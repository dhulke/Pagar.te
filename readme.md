# Pagar.te
Uma versão super simplificada de um Payment Service Provider (PSP) como o Pagar.me.

## Organização e Arquitetura
Como arquitetura do projeto, busquei me basear nos modelos de Clean Architecture e Onion Architecture,
seguindo a Dependency Rule onde camadas internas não dependem ou referenciam camadas externas. Decidi
desenvolver um modulo customizado e mais simples de Dependency Injection, para simplificar o projeto.

O código está dividido nas seguintes camadas de dependência: `EntryPoint(Web) -> UseCaseDI (Dependency Injection) ->
Repository -> Use Case (Application Service) -> [Services] (Domain Service) -> Entity (Aggregate Root)`. Na implementação
da regra de negócio, busquei seguir conceitos de Domain Driven Design, separando o domínio em entities e value objects
e aggregate roots. Para isso, defini que as entidades Transaction e Payable estariam no mesmo aggregate e tornei Transaction
a aggregate root. Também criei value objects para auxiliar na validação dos dados e assim manter o Business Invariant.

Já a estrutura de diretórios está dividida de maneira diferente, visando agrupar arquivos alterados em conjunto.
Dentro da pasta `usecase`, criei outra pasta com o mesmo nome do aggregate root e agrupei todos os use cases que 
operam sobre esse agregate root. Também coloquei dentro dessa pasta todas as implementações de um repositório,
bem como o `UseCaseDi`, assim fica fácil atualizar novas injeções sempre que um novo use case for criado.

## Desenvolvimento
Implementei os use cases seguindo o padrão de projetos Command, provendo uma interface única para que os controllers
possam chama-las e ainda permitindo uma maneira mais cômoda de programar (é mais legal codar na Heap que na Stack :D).

Para a criação da lógica de Cash Ins, eu precisava garantir que o domínio estaria sempre num estado válido e também
quis garantir que todos os erros de validação fossem retornados e não apenas o primeiro erro encontrado. Frente a esses
requisitos, pensei tanto em implementar o padrão Domain Events quanto o padrão CQRS. Este último acabou se mostrando 
mais simples de implementar, dividindo a operação de cash in em dois métodos: `canCashIn` (Query) e `cashIn` (Command).
No entanto, noto que prefiro mais o estilo de Domain Events.

Para o desenvolvimento desse projeto, segui os conceitos de TDD, desenvolvendo primeiro os testes e depois a implementação.
Considerei o "unit" de unit test como sendo a use case e não a classe.

Comecei desenvolvendo as entidades, depois os use cases, depois implementei os repositórios baseados em memória, depois
os controllers e apenas por último os repositórios baseados em postgres. Assim sendo, Pagar.te funciona de duas maneiras:
uma se conectando a um banco postgres e outra é apenas executar o servidor e já está funcionando e passando todos os testes.

## Instalação

#### Memória
```
$ git clone git@github.com:dhulke/Pagar.te.git
$ cd Pagarte
$ npm install
$ npm test
$ npm start
```

#### Postgres
Se já possuir alguma instância do Postgres na máquina, pode apontar o arquivo `db/postgres/knexfile.js` para essa instancia.
```
$ docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -p 5432:5432 postgres
$ git clone git@github.com:dhulke/Pagar.te.git
$ cd Pagarte
$ npm install
$ knex --knexfile db/postgres/knexfile.js migrate:latest
$ npm run testall
$ npm run startpostgres 
```

## APIs
* Faz operação de cash in: `POST http://localhost:3000/transaction/cashin`
```
{
    "userId": "1234",
    "value": 100,
    "description": "Smartband XYZ 3.0",
    "paymentMethod": "credit_card",
    "cardNumber": "0123 4567 8910 1112",
    "cardHolderName": "John Doe",
    "expirationDate": "12/24",
    "cvv": 123
}
```

* Retorna lista de transações do usuario: `GET http://localhost:3000/transaction/list/user/:id`
* Retorna fundos do usuario: `GET http://localhost:3000/transaction/funds/user/:id`

## Todo
Alguns pontos que deixei pra trás por escolha, mas em produção seria necessário trabalhar:
* Implementar pool de conexões
* Reditar as credenciais do git (deixei para facilitar a execução)
* Tratamento correto de valores monetários. Ao invés de usar float, usar uma biblioteca baseada em int para números fracionários.
 
