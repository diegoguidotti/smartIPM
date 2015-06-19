<?php
namespace smartIPM\Tests;
//require_once dirname(__FILE__) . '/../src/ModelUtil.php';

use smartIPM\ModelUtil;
use smartIPM\RunModel;
use smartIPM\Utils;

class RunModelTest extends \PHPUnit_Framework_TestCase
{
  public function test_exeApi()
  {
		$value = "2015-01-01 00:00:00+01;-1.2;9.2:::2015-01-02 00:00:00+01;0.7;14.7:::2015-01-03 00:00:00+01;6.7;13:::2015-01-04 00:00:00+01;8.1;16.3:::2015-01-05 00:00:00+01;3.4;14.6:::2015-01-06 00:00:00+01;4.2;14.8:::2015-01-07 00:00:00+01;7.5;12.9:::2015-01-08 00:00:00+01;4.5;14.4:::2015-01-09 00:00:00+01;8.7;14.4:::2015-01-10 00:00:00+01;8.2;13.3:::2015-01-11 00:00:00+01;5.1;16.7:::2015-01-12 00:00:00+01;2.8;15.4:::2015-01-13 00:00:00+01;5.5;15.3:::2015-01-14 00:00:00+01;7.7;15.1:::2015-01-15 00:00:00+01;6.7;16.3:::2015-01-16 00:00:00+01;9.6;13.9:::2015-01-17 00:00:00+01;8.6;14.2:::2015-01-18 00:00:00+01;3.8;13.2:::";
		$blSep = ":::";
		$tkSep = ";";
		
		$aWeather = Utils::CSV2Array($value, $blSep, $tkSep);
		
		$aOut = array();
		for( $d = 0; $d < count($aWeather)-1; $d++ )
			{
				$tmin  = $aWeather[$d][1];
				$tmax  = $aWeather[$d][2];
				$tmin2 = $aWeather[$d+1][1];
				
				$ret = ModelUtil::hourDegree(5, $tmin, 15, $tmax, 5, $tmin2);
				$ret2 = ModelUtil::arrayCalc( $ret, 'max(:t-10,0)', 'avg' );
				
				$aOut[$d] = $ret2;
			}
		$ret3 = ModelUtil::arrayCalc( $aOut, ':t', 'sum' );
		
		fwrite(STDERR, print_r($aOut));
		fwrite(STDERR, print_r($ret3));
	}
}