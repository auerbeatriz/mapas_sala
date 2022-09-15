const requestURL = "agendamentos.php"

//conexão para request HTTP
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

//obtendo o json e exibindo as informaçõess
request.onload = function() {
    let a = request.response;
    
    listaAgendamentos(a.agendamentos);
  }

/*aqui é onde você popula a tabela
há duas formas de fazer isso:
  a primeira, criando os elementos aqui mesmo, na raça
      ou ainda montando os elementos aqui mesmo usando como base os dias e horarios pra montar uma matriz de ids e depois popular 
            faça isso com um array de horarios e dias da semana pra criar os ids
  a segunda, montando a tabela no body, na raça, e acessando cada elemento aqui
*/
function listaAgendamentos(agendamentos) {
  let body = document.querySelector('body'); //ou outro elemento onde sua tabela vai estar localizada

  for ( let i in agendamentos ) {

    let p = document.createElement('p');
    p.textContent = agendamentos[i].disciplina;

    body.appendChild(p);
  }
}