<?php

/* Essa classe é responsável por todo o acesso
ao banco de dados */

class POST {
    private $conn;
    private $week_id = 7;

    //controla a conexão com o banco
    public function __construct($db){
		$this->conn = $db;
        
	}

    //consulta todos os agendamentos do banco
    public function getBookings($room, $location) {
        $query = "SELECT 
                    periods.name as period, 
                    bookings.day_num, 
                    bookings.notes as classe,
                    rooms.name as room
                FROM bookings
                INNER JOIN periods ON periods.period_id = bookings.period_id
                INNER JOIN rooms ON rooms.room_id = bookings.room_id
                WHERE bookings.week_id = $this->week_id AND rooms.name LIKE '$room' AND rooms.location='$location';";

        $result = mysqli_query($this->conn, $query);

        return  $result;
    }

    //consulta todos os horarios do banco
    public function getPeriods() {
        $query = 'SELECT name FROM periods ORDER BY time_start ASC;';

        $result = mysqli_query($this->conn, $query);

        return  $result;
    }

    public function getLocations() {
        $query = "SELECT location FROM rooms 
                    RIGHT JOIN bookings ON rooms.room_id = bookings.room_id
                    WHERE location IS NOT NULL AND location NOT LIKE 'ADMINISTRATIVO'
                    GROUP BY location;";

        $result = mysqli_query($this->conn, $query);

        return  $result;
    }

    public function getRooms($location) {
        $query = "SELECT name FROM rooms 
                    RIGHT JOIN bookings ON rooms.room_id = bookings.room_id
                    WHERE location LIKE '$location' AND location IS NOT NULL AND bookings.week_id = $this->week_id
                    GROUP BY name
                    ORDER BY name ASC;";

        $result = mysqli_query($this->conn, $query);

        return $result;
    }

    public function getClasses() {
        $query = "SELECT notes FROM bookings
                    WHERE week_id = $this->week_id
                    GROUP BY notes
                    ORDER BY notes ASC";
        
        $result = mysqli_query($this->conn, $query);

        return $result;
    }

    public function getClassBooking($class) {
        $query = "SELECT              
                    periods.name as period, 
                    bookings.day_num, 
                    bookings.notes as classe,
                    rooms.name as room,
                    rooms.location as location
                FROM bookings
                INNER JOIN periods ON periods.period_id = bookings.period_id
                INNER JOIN rooms ON rooms.room_id = bookings.room_id
                WHERE bookings.week_id = $this->week_id AND bookings.notes LIKE '%$class%'
                ORDER BY periods.name ASC;";
        
        $result = mysqli_query($this->conn, $query);

        return $result;
    }

    public function getClassDays($class) {
        $query = "SELECT              
                    bookings.day_num 
                FROM bookings
                INNER JOIN periods ON periods.period_id = bookings.period_id
                INNER JOIN rooms ON rooms.room_id = bookings.room_id
                WHERE bookings.week_id = $this->week_id AND bookings.notes LIKE '%$class%'
                GROUP BY bookings.day_num
                ORDER BY periods.name ASC;";

        $result = mysqli_query($this->conn, $query);

        return $result;
    }

    public function getClassPeriods($class) {
        $query = $query = "SELECT              
                        periods.name as period
                    FROM bookings
                    INNER JOIN periods ON periods.period_id = bookings.period_id
                    INNER JOIN rooms ON rooms.room_id = bookings.room_id
                    WHERE bookings.week_id = $this->week_id AND bookings.notes LIKE '%$class%'
                    GROUP BY periods.name
                    ORDER BY periods.name ASC;";

        $result = mysqli_query($this->conn, $query);

        return $result;

    }
}

?>