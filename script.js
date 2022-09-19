const locationUrl = "locations.php";
const roomUrl = "rooms.php?location=";
const periodsUrl = "periods.php";
const bookingsUrl = "bookings.php?room=";
const diaSemana = ["","Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

/* salvando os periodos existentes */
let periods;

const getPeriods = async () => {
  const response = await fetch(periodsUrl);
  const data = await response.json();
  periods = data.data;
  return data;
};

(async () => {
  await getPeriods();
})();

/* aqui construimos a pagina */

const body = document.querySelector("body");

function getData(url, callback){
    var obj;

    fetch(url)
      .then(response => response.json())
      .then(data => obj = data)
      .then(() => callback(obj.data));
}
  
function displayLocations(locations) {
    for (let i in locations) {
        l = locations[i];

        const div = document.createElement("div");
        div.id = l;

        const p = document.createElement("p");
        p.textContent = l;
        p.addEventListener("click", function() {
            getData(roomUrl+p.textContent, loadTables)
        });
        const divTables = document.createElement("div");
        divTables.id = l + "-tables";
        divTables.className = "tableContainer";

        div.appendChild(p);
        div.append(divTables);
        body.appendChild(div);
    }
}

function loadTables(data) {
    const location = data[0];
    const divParent = document.getElementById(location+"-tables");

    for(let i=1; i < data.length; i++) {
        const room = data[i];

        if (document.getElementById(room) == null) {
            let div = document.createElement("div");
            div.id = room;

            createEmptyTable(div, room);
            getData(bookingsUrl+room+"&location="+location, populateTable);
            let p = document.createElement("p");
            p.textContent = room;

            divParent.append(p);
            divParent.appendChild(div);
        }
    }
}

function createEmptyTable(div, room) {
    const table = document.createElement("table");
    table.id = "table-"+room;

    /*header da tabela */
    let tr = document.createElement('tr');

    for (let i in diaSemana) {
        th = document.createElement('th');
        th.textContent = diaSemana[i];

        tr.appendChild(th);
    }

    table.appendChild(tr);

    /*celulas das tabelas */
    for (let i in periods) {
        //cria os campos de horario da tabela
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = periods[i];
        tr.appendChild(td);

        //cria as celulas que serao populadas com os dados posteriormente,
        //com o id de periodo+diasemana
        d = 1;
        while (d < 6) {
            let td = document.createElement('td');
            td.id = periods[i] + d + room;
            tr.appendChild(td);
            d++;
        }

        //adiciona a linha na tabela
        table.appendChild(tr);
    }

    div.appendChild(table);
}

function populateTable(data) {
    console.log(data);
    for (let i in data) {
        let booking = data[i];

        console.log(booking);

        let id = booking.period+booking.day_num+booking.room;

        if (document.getElementById(id) != null) {
            document.getElementById(id).textContent = booking.classe;
        }
    }
    
}