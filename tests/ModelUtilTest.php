<?php
namespace smartIPM\Tests;
//require_once dirname(__FILE__) . '/../src/ModelUtil.php';

use smartIPM\ModelUtil;

class ModelUtilTest extends \PHPUnit_Framework_TestCase
{
  public function test_sinMinMax()
  {
		$ret = \smartIPM\ModelUtil::sinMinMax(8, 20, 10, 25);
		fwrite(STDERR, print_r($ret));
  }
}

