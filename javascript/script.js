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

/* funcao responsavel por obter os dados do servidor */
function getData(url, callback){
    var obj;

    fetch(url)
      .then(response => response.json())
      .then(data => obj = data)
      .then(() => callback(obj.data));
}

/*  primeira funcao chamada em body.onload
    essa funcao recebe uma lista de strings com o nome das localizacoes do car
    e constroi os elementos collapsable */
function displayLocations(locations) {
    const div = document.getElementById("div-rooms");

    for (let i in locations) {
        const l = locations[i];

        const container = document.createElement("div");
        container.classList = "roomContainer";

        //criando o botao
        const b = document.createElement("button");
        b.textContent = l;
        b.classList = "collapsible";
        b.id = l;

        // config comportamento collapsable
        b.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
        });

        //exibindo o botao collapsable
        container.appendChild(b);
        div.appendChild(container);

        // chama a funcao para construir as tabelas
        getData(roomUrl+l, loadTables);

    }
}

/* funcao chamada apos os botoes collapsable serem criados para montar as tabelas */
function loadTables(data) {
    const location = data[0];
    const b = document.getElementById(location);

    const divContent = document.createElement("div");
    divContent.id = "container-" + location;
    divContent.classList = "tableContainer";

    
    for(let i=1; i < data.length; i++) {
        const room = data[i];

        if (document.getElementById(room) == null) {

            /* esse div extra foi criado para ser o div "impresso" no pdf de exportação
               cada tabela está dentro de seu container para ser exportada isoladamente */
            let divTable = document.createElement("div");
            divTable.id = "table-container-" + location;
            divContent.appendChild(divTable);

            let p = document.createElement("p");
            p.textContent = room;
            divTable.appendChild(p);

            // botao para criar e exportar o pdf da tabela
            let button = document.createElement("button");
            button.textContent = "exportar";
            button.addEventListener("click", function() { exportPdf("table-container-" + location) });
            divTable.appendChild(button);

            //efetivamente cria uma tabela que sera populada com os dados da sala especifica
            createEmptyTable(divTable, room);
            getData(bookingsUrl+room+"&location="+location, populateTable);

        }
    }

    divContent.style.display = "none";

    b.after(divContent);
}

/*  Essa funcao eh responsavel por criar a estrutura da tabela que sera preenchida com os agendamentos
 *  A ideia principal eh que cada <td> tera um id periodo+diasemana
 *  O agengdamento que tiver periodo+diasemana da sala recebida sera encaixada naquela <td>
 *  Isso funciona pois nao ha como duas classes agendarem a mesma sala no mesmo horario do mesmo dia */
function createEmptyTable(div, room) {
    const table = document.createElement("table");
    table.id = "table-"+room;

    //header da tabela
    let tr = document.createElement('tr');

    for (let i in diaSemana) {
        th = document.createElement('th');
        th.textContent = diaSemana[i];

        tr.appendChild(th);
    }

    table.appendChild(tr);

    //celulas das tabelas
    for (let i in periods) {
        //cria os campos de horario da tabela
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.classList = "period";
        td.textContent = periods[i];
        tr.appendChild(td);

        //cria as celulas que serao populadas com os dados posteriormente,
        d = 1;
        while (d < 6) {
            let td = document.createElement('td');
            td.id = periods[i] + d + room;
            tr.appendChild(td);
            d++;
        }

        table.appendChild(tr);
    }

    div.appendChild(table);
}

/* Essa funcao eh chamada para alocar os agendamentos de uma sala especifica nas <td>s correspondentes
 * da tabela criada anteriormente */
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


/* Essa funcao eh chamada em body.onload para exibir todas as classes possiveis para consulta */
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

/* Essa funcao eh chamada quando o botao "pesquisar" eh selecionado
 * Pega o valor que foi selecionado e chama a funcao para carregar a tabela de agendamentos da classe */
function displayClasses() {
    const select = document.querySelector('[name="notes"]');
    const op = select.options[select.selectedIndex].value;

    getData(classUrl+op, loadClasses);
    
}

/* Funcao responsavel por carregar os agendamentos de uma classe especifica */
function loadClasses(data) {
    // dados importantes para construir a estrutura da tabela
    const op = data[0]["classe"];
    const days = data[data.length - 2];
    const periodos = data[data.length -1];
    let tds = new Object();

    const div = document.getElementById("div-search-result");

    // caso tenha uma tabela de outra classe, exclua
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

    // body da tabela
    for (i in periodos) {
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.classList = "period";
        td.textContent = periodos[i];

        tr.appendChild(td);

        for (let j in days) {
            td = document.createElement("td");

            // adiciona a <td> criada dentro de um obj na chave periodo+diasemana
            // isso eh usado pois a pagina ainda nao foi renderizada com a <td>
            // logo ela sera inacessavel nessa rota
            // mas nesse obj ela podera ser acessada e modificada antes de ser renderizada
            tds[periodos[i]+days[j]] = td;

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    // efetivamente carrega os dados do agendamento, tomando o cuidado para salas que foram agendadas no mesmo dia e horario
    for (i=0; i < data.length - 2; i++) {
        td = tds[(data[i].period+data[i].day_num)];

        if (td.textContent == "") {
            td.textContent = data[i].room + " - " + data[i].location;
        } else {
            td.appendChild(document.createElement("br"));
            td.appendChild(document.createTextNode(data[i].room + " - " + data[i].location));
        }
        
    }

    div.appendChild(table);
    
}

/*  Essa funcao eh chamada quando o botao "limpar" do formulario eh acionado
 *  remove a tabela exibida na pesquisa, se ela foi criada */
function cleanSearch() {

    if (document.getElementById("div-search-result").childElementCount > 0) {
        document.getElementById("table-search").remove();
        document.getElementById("p-search").remove();
    }
    
}