<?php

/* Essa página é responsável por criar um JSON
de resposta com todas as classes agendadas
*/

//importanto arquivos de acesso ao bd
require_once("config.php");
require_once("post.php");

$post = new Post($con);

$class = $_GET["class"];

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$bookings = $post->getClassBooking($class);
$numRows =  mysqli_num_rows( $bookings );

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["data"] = array();

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($bookings) ) {
        $b = array(
            "period" => $row["period"],
            "day_num" => $row["day_num"],
            "classe" => $row["classe"],
            "room" => $row["room"],
            "location" => $row["location"]
        );
        array_push( $response["data"], $b);
    }


    $weekDays = $post->getClassDays($class);
    $numRows =  mysqli_num_rows( $weekDays );

    if ($numRows > 0) {
        $days = array();

        while( $row = mysqli_fetch_assoc($weekDays) ) {
            array_push($days, $row["day_num"]);
        }

        array_push($response["data"], $days);

        $periods = $post->getClassPeriods($class);
        $numRows = mysqli_num_rows( $weekDays );

        if ($numRows > 0) {
            $period = array();

            while( $row = mysqli_fetch_assoc($periods) ) {
                array_push($period, $row["period"]);
            }
    
            array_push($response["data"], $period);

            $response["success"] = 1;
        }
        
    }

    
} else {
    /*se a consulta nao aconteceu*/

    //retorna uma mensagem de erro
    $response["success"] = 0;
    $response["message"] = "Não foi possível recuperar os dados.";
}

//retorno do json
echo json_encode($response);

?>