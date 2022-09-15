<?php

/* Essa página é responsável por criar um JSON
de resposta com todos os agendamentos cadastrados
*/

//importanto arquivos de acesso ao bd
require_once("config.php");
require_once("post.php");

$post = new Post($con);

//array responsavel pela resposta Json
$response = array();

//obtendo os dados do banco
$agendamentos = $post->getBookings();
$numRows =  mysqli_num_rows( $agendamentos );

if( $numRows > 0) {
    /*se a consulta aconteceu*/

    $response["success"] = 1;
    $response["agendamentos"] = array();

    //coloca os dados obtidos no array de resposta
    while( $row = mysqli_fetch_assoc($agendamentos) ) {
        $agendamento = array(
            "professor" => $row["professor"],
            "turma" => $row["turma"],
            "horario" => $row["horario"],
            "dia_semana" => $row["dia_semana"],
            "disciplina" => $row["disciplina"]
        );

        array_push( $response["agendamentos"], $agendamento);
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