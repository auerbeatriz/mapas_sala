<?php

/* Essa página é responsável por criar um JSON
de resposta com todas as classes agendadas
*/

//importanto arquivos de acesso ao bd
require_once("config.php");
require_once("post.php");

$post = new Post($con);

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$classes = $post->getClasses();
$numRows =  mysqli_num_rows( $classes );

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["success"] = 1;
    $response["data"] = array();

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($classes) ) {
        array_push( $response["data"], $row["notes"]);
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