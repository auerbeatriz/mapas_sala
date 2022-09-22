<?php

/* Essa página é responsável por criar um JSON
de resposta com todos os agendamentos cadastrados
*/

//importanto arquivos de acesso ao bd
require_once("config.php");
require_once("post.php");

$post = new Post($con);

$room = $_GET["room"];
$location = $_GET["location"];

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$bookings = $post->getBookings($room, $location);
$numRows =  mysqli_num_rows( $bookings );

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["success"] = 1;
    $response["data"] = array();

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($bookings) ) {
        $b = array(
            "period" => $row["period"],
            "day_num" => $row["day_num"],
            "room" => $row["room"],
            "classe" => $row["classe"],
        );

        array_push( $response["data"], $b);
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