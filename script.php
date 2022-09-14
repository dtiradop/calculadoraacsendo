<?php

date_default_timezone_set('UTC');

	$dataphp = date("y");
	
	$file = 'codigo.txt';
    $temp = file_get_contents($file);
    $paiscodigo = substr($temp, 0, 2);
    $datatxt = substr($temp, 2, 2);
    $numeralstring = substr($temp, 4, 4);
    $numeral = intval($numeralstring);
    $numeral = $numeral + 1;
    $numeral = sprintf('%04d', $numeral);
    
    if ($datatxt !== $dataphp){
        //ano novo, código novo
        $datatxt = $dataphp;
        $numeral = "0123";
    }
    
	$content = $paiscodigo . $datatxt . $numeral;
    file_put_contents($file, $content);
    echo json_encode(array("result" => "$content"));

?>