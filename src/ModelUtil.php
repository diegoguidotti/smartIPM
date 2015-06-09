<?php

namespace smartIPM;
 
class ModelUtil {

	//$test = '2+exp(:tmax)';
	//echo "Input: <b>".$test."</b><br/>";
	//echo "res: <b>".calc($test, Array(':tmax'=>2))."</b>";

	public static function calc($equation, $aVar)
	{
			while (list($key, $val) = each( $aVar)) {
				$equation= str_replace($key, $val, $equation);
					echo "$key => $val<br/>";
			}
			

			// Remove whitespaces
			$equation = preg_replace('/\s+/', '', $equation);
			echo $equation."<br/>";

			$number = '((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|pi|π|x)'; // What is a number

			$functions = '(?:sinh?|cosh?|tanh?|acosh?|asinh?|atanh?|exp|log(10)?|deg2rad|rad2deg
									|sqrt|pow|abs|intval|ceil|floor|round|(mt_)?rand|gmp_fact)'; // Allowed PHP functions
			$operators = '[\/*\^\+-,]'; // Allowed math operators
			$regexp = '/^([+-]?('.$number.'|'.$functions.'\s*\((?1)+\)|\((?1)+\))(?:'.$operators.'(?1))?)+$/'; // Final regexp, heavily using recursive patterns

			if (preg_match($regexp, $equation))
			{
					$equation = preg_replace('!pi|π!', 'pi()', $equation); // Replace pi with pi function        
					eval('$result = '.$equation.';');
			}
			else
			{
					$result = false;
			}
			return $result;
	}

	public static function sinMinMax( $hmin, $hmax, $tmin, $tmax )
	{
		$mb = floatval(($tmax-$tmin)/2);
		$sb = floatval(($tmax+$tmin)/2);
		
		$period = intval($hmax-$hmin);
		
		$sa = -floatval(pi()/2);
		$ma = floatval(pi()/$period);
		
		$aRet = array();
		for( $d = 0; $d<$period; $d++ )
			{
				$aRet[$d] = $sb + ($mb*sin($ma*$d+$sa));
			}
		
		return $aRet;
	}

	public static function sinMaxMin( $hmin, $hmax, $tmin, $tmax )
	{
		$mb = floatval(($tmax-$tmin)/2);
		$sb = floatval(($tmax+$tmin)/2);
		
		$period = intval($hmin+24-$hmax);
		
		$sa = floatval(pi()/2);
		$ma = floatval(pi()/$period);
		
		$aRet = array();
		for( $d = 0; $d<$period; $d++ )
			{
				$aRet[$d] = $sb + ($mb*sin($ma*$d+$sa));
			}
		
		return $aRet;
	}
	
	public static function hourDegree( $hmin, $tmin, $hmax, $tmax, $hmin2, $tmin2 )
	{
		$minmax = ModelUtil::sinMinMax( $hmin, $hmax, $tmin, $tmax );
		$maxmin = ModelUtil::sinMaxMin( $hmin2, $hmax, $tmin2, $tmax );
		
		$nLen = count($minmax)+count($maxmin);
		$aRet = array();
		for( $r = 0; $r < $nLen; $r++ )
			{
				if( $r < count($minmax) )
					$aRet[$r] = $minmax[$r];
				else
					$aRet[$r] = $maxmin[$r-count($minmax)];
			}
		
		return $aRet;
	}

}
