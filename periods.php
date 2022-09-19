<?php

require_once("config.php");
require_once("post.php");

$post = new Post($con);

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$bookings = $post->getPeriods();
$numRows =  mysqli_num_rows( $bookings );

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["success"] = 1;
    $response["data"] = array();

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($bookings) ) {
        array_push( $response["data"], $row["name"]);
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