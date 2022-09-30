const locationUrl = "php/locations.php";
const roomUrl = "php/rooms.php?location=";
const periodsUrl = "php/periods.php";
const bookingsUrl = "php/bookings.php?room=";
const bookingsNotesUrl = "php/bookingsnotes.php";
const classUrl = "php/classbooking.php?class=";
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
    const div = document.getElementById("rooms");

    for (let i in locations) {
        const l = locations[i];

        const container = document.createElement("div");
        container.classList = "roomContainer";

        //criando o botao
        const b = document.createElement("button");
        b.textContent = l;
        b.classList = "collapsible";
        b.id = l;

        b.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
        });

        //exibindo a checkbox
        container.appendChild(b);
        div.appendChild(container);

        getData(roomUrl+l, loadTables);

    }
}

function loadTables(data) {
    const location = data[0];
    const b = document.getElementById(location);

    const divContent = document.createElement("div");
    divContent.id = "container-" + location;
    divContent.classList = "tableContainer";

    for(let i=1; i < data.length; i++) {
        const room = data[i];

        if (document.getElementById(room) == null) {

            let p = document.createElement("p");
            p.textContent = room;
            divContent.appendChild(p);

            createEmptyTable(divContent, room);
            getData(bookingsUrl+room+"&location="+location, populateTable);

        }
    }

    divContent.style.display = "none";

    b.after(divContent);
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
        td.classList = "period";
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
    for (let i in data) {
        let booking = data[i];

        //console.log(booking);

        let id = booking.period+booking.day_num+booking.room;

        if (document.getElementById(id) != null) {
            document.getElementById(id).textContent = booking.classe;
        }
    }
    
}

function displayOptions(classes) {
    const select = document.querySelector("select");

    classes.forEach(element => {
        const op = document.createElement("option");
        op.id = element;
        op.value = element;
        op.textContent = element;

        select.appendChild(op);
    });
}

function displayClasses() {
    const select = document.querySelector('[name="notes"]');
    const op = select.options[select.selectedIndex].value;

    getData(classUrl+op, loadClasses);
    
}


function loadClasses(data) {
    // dados importantes para construir a estrutura da tabela
    const op = data[0]["classe"];
    const days = data[data.length - 2];
    const periodos = data[data.length -1];
    let tds = new Object();

    // caso tenha uma tabela de outra classe, exclua
    const div = document.getElementById("search-table");

    cleanSearch();

    // nome da materia
    const p = document.createElement("p");
    p.id = "p-search";
    p.textContent = op;
    div.appendChild(p);

    // constroi a nova tabela
    const table = document.createElement("table");
    table.id = "table-search";

    // header da tabela
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    tr.append(th);

    for (let i in days) {
        th = document.createElement('th');
        th.textContent = diaSemana[days[i]];

        tr.appendChild(th);
    }

    table.appendChild(tr);

    for (i in periodos) {
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.classList = "period";
        td.textContent = periodos[i];

        tr.appendChild(td);

        for (let j in days) {
            td = document.createElement("td");
            tds[periodos[i]+days[j]] = td;

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    for (i=0; i < data.length - 2; i++) {
        td = tds[(data[i].period+data[i].day_num)];

        if (td.textContent == "") {
            td.textContent = data[i].room + data[i].location;
        } else {
            td.appendChild(document.createElement("br"));
            td.appendChild(document.createTextNode(data[i].room + data[i].location));
        }
        
    }

    div.appendChild(table);
    
}

function cleanSearch() {

    if (document.getElementById("search-table").childElementCount > 0) {
        document.getElementById("table-search").remove();
        document.getElementById("p-search").remove();
    }
    
}