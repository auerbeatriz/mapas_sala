<?php

/* Essa classe é responsável por todo o acesso
ao banco de dados */

class POST {

    private $conn;

    //controla a conexão com o banco
    public function __construct($db){
		$this->conn = $db;
	}

    //consulta todos os agendamentos do banco
    public function getBookings() {
        $query = "SELECT professor.nome as professor, turma.nome as turma, horario, dia_semana, sala as disciplina FROM agendamento
                    INNER JOIN professor ON professor.id = agendamento.fk_PROFESSOR_id
                    INNER JOIN turma ON turma.id = agendamento.fk_TURMA_id;";
        
        $result = mysqli_query($this->conn, $query);

        return  $result;
    }

}

?>