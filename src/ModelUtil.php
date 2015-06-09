<?php

namespace smartIPM;
 
class ModelUtils {


	public static function ()
	{
		
		
		//return $aRows;
	}





//$test = '2+exp(:tmax)';
//echo "Input: <b>".$test."</b><br/>";
//echo "res: <b>".calc($test, Array(':tmax'=>2))."</b>";





function calc($equation, $aVar)
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


/*
  public double[] hourDegree(int hmin, double tmin, int hmax, double tmax, int hmin2, double tmin2){
        double[] minmax=sinMinMax(hmin, hmax, tmin, tmax);
        double[] maxmin=sinMaxMin(hmin2, hmax, tmin2, tmax);
        
        double[] ret = new double[minmax.length+maxmin.length];
        for(int r=0; r<ret.length; r++){
            if(r<minmax.length)
                ret[r]=minmax[r];
            else
                ret[r]=maxmin[r-minmax.length];
        }
        return ret;
    }
    
    //vettore orario dalla minima alla massima
    public double[] sinMinMax(int hmin, int hmax, double tmin, double tmax){
        double mb=(tmax-tmin)/2;
        double sb=(tmax+tmin)/2;
        int durata=hmax-hmin;
        double sa=-Math.PI/2;
        double ma=Math.PI/durata;
        
        double[] ret=  new double[durata];
        for (int d=0; d<durata; d++){
            ret[d]=sb+(mb*Math.sin(ma*d+sa));
            //System.out.println(d+" "+ret[d]);
        }
        return ret;
    }
    
    //vettore orario dalla massima alla minima
    public double[] sinMaxMin(int hmin, int hmax, double tmin, double tmax){
        double mb=(tmax-tmin)/2;
        double sb=(tmax+tmin)/2;
        int durata=hmin+24-hmax;
        double sa=Math.PI/2;
        double ma=Math.PI/durata;
        double[] ret = new double[durata];
        for (int d=0; d<durata; d++){
            ret[d]=sb+(mb*Math.sin(ma*d+sa));
        }
        return ret;
    }    
*/


?>
