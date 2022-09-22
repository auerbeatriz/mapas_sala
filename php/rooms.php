<?php

/* Essa página é responsável por criar um JSON
de resposta com as salas com agendamento de algum prédio
*/

//importanto arquivos de acesso ao bd
require_once("config.php");
require_once("post.php");

$post = new Post($con);

$location = $_GET["location"]; //qual o predio requisitado

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$rooms = $post->getRooms($location);
$numRows =  mysqli_num_rows($rooms);

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["success"] = 1;
    $response["data"] = array();
    array_push($response["data"], $location);

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($rooms) ) {
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