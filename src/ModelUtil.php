<?php

namespace smartIPM;
 
class ModelUtil {

	public static function calc($equation, $aVar)
	{
			while (list($key, $val) = each( $aVar)) {
				$equation= str_replace($key, $val, $equation);
					//echo "$key => $val<br/>";
			}
			

			// Remove whitespaces
			$equation = preg_replace('/\s+/', '', $equation);
			//echo $equation."<br/>";

			$number = '((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|pi|π|x)'; // What is a number

			$functions = '(?:sinh?|cosh?|tanh?|acosh?|asinh?|atanh?|exp|log(10)?|deg2rad|rad2deg
									|sqrt|pow|abs|intval|ceil|floor|round|(mt_)?rand|gmp_fact|max|min)'; // Allowed PHP functions
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
	
	public static function arrayCalc( $aVal, $function, $operator )
	{
		// function = max(:t-10, 0)
		$aCalc = array();
		for( $nV = 0; $nV < count($aVal); $nV++ )
			{
				$aCalc[$nV] = ModelUtil::calc($function, array(':t'=>$aVal[$nV]));
			}
		
		$fSum = 0;
		$min  = 100;
		$max  = -1;
		for( $nC = 0; $nC < count($aCalc); $nC++ )
			{
				$min = min($min, $aCalc[$nC]);
				$max = max($max, $aCalc[$nC]);
				$fSum += $aCalc[$nC];
			}

		switch( $operator )
			{
				case 'avg':
					$ret = $fSum/24;
					break;
					
				case 'min':
					$ret = $min;
					break;
					
				case 'max':
					$ret = $max;
					break;
					
				case 'sum':
					$ret = $fSum;
					break;
			}
		
		//$aCalc['result'] = $ret;
		
		return $ret;
	}
}
