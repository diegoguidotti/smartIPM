<?php
namespace smartIPM\Tests;
//require_once dirname(__FILE__) . '/../src/ModelUtil.php';

use smartIPM\ModelUtil;

class ModelUtilTest extends \PHPUnit_Framework_TestCase
{
  public function test_sinMinMax()
  {
		$hmin = 8; $hmax = 20; $tmin = 10; $tmax = 25;
		$ret = ModelUtil::sinMinMax($hmin, $hmax, $tmin, $tmax);
		
		$this->assertEquals($hmax-$hmin,count($ret));
		$this->assertEquals(17.5,$ret[6]);
		
		$hmin = 8; $hmax = 20; $tmin = 10; $tmax = 10;
		$ret2 = ModelUtil::sinMinMax($hmin, $hmax, $tmin, $tmax);
  
		$this->assertEquals($hmax-$hmin,count($ret2));
		$this->assertEquals($tmin,$ret2[6]);
		$this->assertEquals($tmax,$ret2[6]);
  	
  	//fwrite(STDERR, print_r($ret));
	}
	
  public function test_sinMaxMin()
  {
		$hmin = 8; $hmax = 20; $tmin = 10; $tmax = 25;
		$ret = ModelUtil::sinMaxMin($hmin, $hmax, $tmin, $tmax);
		
		$this->assertEquals($hmax-$hmin,count($ret));
		$this->assertEquals(17.5,$ret[6]);
		
		$hmin = 8; $hmax = 20; $tmin = 10; $tmax = 10;
		$ret2 = ModelUtil::sinMinMax($hmin, $hmax, $tmin, $tmax);
  
		$this->assertEquals($hmax-$hmin,count($ret2));
		$this->assertEquals($tmin,$ret2[6]);
		$this->assertEquals($tmax,$ret2[6]);
  	
  	//fwrite(STDERR, print_r($ret));
	}
	
	
  public function test_hourDegree()
  {
		$hmin = 5; $hmax = 15; $tmin = 5; $tmax = 25; $hmin2 = 5; $tmin2 = 5;
		$ret = ModelUtil::hourDegree($hmin, $tmin, $hmax, $tmax, $hmin2, $tmin2);
		
		$this->assertEquals(24,count($ret));
		$this->assertEquals(15,$ret[5]);
		$this->assertEquals(15,$ret[17]);
		
		$hmin = 5; $hmax = 15; $tmin = 5; $tmax = 5; $hmin2 = 5; $tmin2 = 5;
		$ret2 = ModelUtil::hourDegree($hmin, $tmin, $hmax, $tmax, $hmin2, $tmin2);
  
		$this->assertEquals($tmin,$ret2[6]);
		$this->assertEquals($tmax,$ret2[6]);
		$this->assertEquals($tmin,$ret2[12]);
		$this->assertEquals($tmax,$ret2[12]);
  	
		$hmin = 5; $hmax = 15; $tmin = 5; $tmax = 25; $hmin2 = 5; $tmin2 = 7;
		$ret3 = ModelUtil::hourDegree($hmin, $tmin, $hmax, $tmax, $hmin2, $tmin2);
  	
		// fwrite(STDERR, print_r($ret));
		// fwrite(STDERR, print_r($ret2));
		// fwrite(STDERR, print_r($ret3));
		$this->assertEquals(15,$ret3[5]);
		$this->assertEquals(16,$ret3[17]);
	}

  public function test_calc()
  {
		$func = '2+exp(:tmax)';
		$res = ModelUtil::calc($func, Array(':tmax'=>0));
		
		$this->assertEquals(3,$res);
		//fwrite(STDERR, print($res));
		
		$func = '2+:tmax';
		$res2 = ModelUtil::calc($func, Array(':tmax'=>3));
		
		$this->assertEquals(5,$res2);
  
  	$func = '2+5';
		$res3 = ModelUtil::calc($func, Array(':tmax'=>0));
		
		$this->assertEquals(7,$res3);
  
  	$func = 'pi';
		$res3 = ModelUtil::calc($func, Array(':tmax'=>0));
		
		$this->assertEquals(3.1415926535897931,$res3);
  	
  	$func = 'max(:num, 0)';
		$res4 = ModelUtil::calc($func, Array(':num'=>-10));
		
		$this->assertEquals(0,$res4);
  	
  	$func = 'max(:num, 0)';
		$res5 = ModelUtil::calc($func, Array(':num'=>10));
		
		$this->assertEquals(10,$res5);
	}
	
	public function test_arrayCalc()
	{
		$hmin = 5; $hmax = 15; $tmin = 5; $tmax = 25; $hmin2 = 5; $tmin2 = 5;
		$ret = ModelUtil::hourDegree($hmin, $tmin, $hmax, $tmax, $hmin2, $tmin2);
		
		$ret2 = ModelUtil::arrayCalc( $ret, 'max(:t-20,0)', 'sum' );
		
// 		fwrite(STDERR, print_r($ret));
// 		fwrite(STDERR, print_r($ret2));
	}
}

