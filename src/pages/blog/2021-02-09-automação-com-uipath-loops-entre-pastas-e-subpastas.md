---
templateKey: blog-post
title: "Automação com UiPath: Loops entre pastas e subpastas"
date: 2021-02-09T15:05:02.645Z
description: Duas formas de processar o conteúdo dentro de pastas e subpastas.
featuredpost: true
featuredimage: /img/uipath-act-4.png
tags:
  - uipath
  - rpa
---
Nesse post vamos fazer dois loops:

* Entrar em uma pasta e abrir todas suas subpastas
* Entrar em cada arquivo dentro de cada uma dessas subpastas

Para exemplo desse post, vamos imaginar que nosso cliente envia via FTP uma pasta por dia com vários CSV dentro. 

![Estrutura de pastas do exemplo](/img/estrutura-pastas.png "Estrutura de pastas do exemplo")

Precisamos extrair alguns dados dessas planilhas, vamos ao fluxo:

Na inicialização, vamos colocar em um array todas as **pastas** que estiverem dentro da principal, vai que acumularam alguns dias, como os finais de semana:

```jsx
Directory.GetDirectories(str_pasta,"*.*", SearchOption.AllDirectories)
```

Dentro dessa pasta tem apenas uma fixa, a "processadas", onde guardamos as que já fizemos extração. Vamos excluir essa pasta do array, primeiro pegando o nome da pasta:

```jsx
str_pasta + “processadas”
```

E depois eliminando ele do array:

```jsx
arr_folders.Where(Function(s) s <> str_procesadas).ToArray
```

Vamos verificar se há alguma pasta a ser processada:

![Atividade UiPath - verificar se ha pastas](/img/uipath-act-4.png "Atividade UiPath - verificar se ha pastas")

Se sim, vamos para o próximo fluxo:

![Atividade UiPath - Condicao ](/img/uipath-act-5.png "Atividade UiPath - Condicao ")

Na etapa seguinte, temos dois loops:

* O que roda todas as pastas do dia (se a ultima vez que a automação rodou foi na sexta e o FTP alimenta a pasta também aos finais de semana, por exemplo, então haverá mais de uma pasta do dia a ser processada)
* O dos arquivos dentro de cada uma dessas pastas do dia

Primeiro, vamos pegar a primeira pasta que estiver no array:

```jsx
str_pastaDoDia = arr_folders(0).ToString
```

E então criamos uma variável de array, com todos os **arquivos** que estiverem dentro dela:

```jsx
arr_temp = Directory.GetFiles(str_pastaDoDia)
```

Dentro desse array que vamos rodar um for loop:

![Atividade UiPath - For Loop](/img/uipath-act-6.png "Atividade UiPath - For Loop")

Cada item corresponde a uma planilha, mas poderia ser um arquivo PDF para passar um OCR, um txt, ou qualquer outro tipo de extração. Enfim, nesse caso vamos extrair algumas variáveis que estão sempre na segunda linha da primeira coluna da planilha:

```jsx
str_temp = dt.row(0)(1).tostring
```

E inserir ela em uma datatable (preferencialmente, previamente criada na inicialização) com a atividade add row:

![Atividade uiPath - Add Row](/img/uipath-act-7.png "Atividade uiPath - Add Row")

Por fim, vamos transferir esse arquivo para outra pasta. Para isso, primeiro precisamos do nome do arquivo, vamos extrair com uma atividade ou uma regex:

```jsx
str_tempp = System.Text.RegularExpressions.Regex.match(item.tostring, "(?<=\d{4}-\d{2}-\d{2}).*").ToString
```

No meu caso o caminho do arquivo tem um padrão *C:\computador\usuario\...\2021-02-01\nomedoarquivo.csv*, então a regex acima pega qualquer informação á partir da última barra. Enfim, em seguida utilizar a atividade move file:

![Atividade UiPath - Move File](/img/uipath-act-8.png "Atividade UiPath - Move File")

Essa é uma forma de sinalizar que o arquivo foi processado. 

Outras formas também poderiam ser trocar o nome do arquivo, inserir alguma mensagem dentro do próprio arquivo (quando possível), reunir o nome de todos eles e enviar apenas os nomes para o usuário checar - através do arquivo com os logs, por exemplo - ou deletar ele completamente. Depende do que fizer mais sentido para os agentes envolvidos no processo.

Essa sinalização de que o arquivo foi processado é somente para caso uma pessoa vá checar manualmente, pois o loop vai terminar quando todos os arquivos da array forem processados como item. Aliás essa é a razão para não colocarmos a função que extrai todos os arquivos direto no loop:

![Atividade Uipath - For Loop ](/img/uipath-act-9.png "Atividade Uipath - For Loop ")

Se feito como na imagem acima, não é possível fazer alterações (dentro do loop) que mudem os arquivos de caminho ou sequer trocar seus nomes, pois o UiPath vai levantar um erro avisando que, durante o loop, houve **modificação no array** que ele esta sendo processando (no caso, todos os arquivos dentro de tal diretório), então para não correr o risco de entrar em um loop infinito, ele da erro e pára o processo. Não faça assim, crie uma variável para o array antes do loop.

Enfim, Ao finalizar a extração de dados em cada um dos arquivos dentro da pasta, ainda temos outro loop que esta verificando se há mais ~pastas do dia com arquivos dentro. Esse loop nós estamos fazendo "manualmente" e não dentro da atividade for each, portanto vamos excluir da array o primeiro item que já processamos (a primeira pasta).

```jsx
arr_folders = arr_folders.Where(Function(s) s <> str_pastaDia).ToArray
```

E verificar se ainda há outras:

![Atividade Uipath - Loop externo](/img/uipath-act-10.png "Atividade Uipath - Loop externo")

Se houverem outras, o programa vai pegar novamente o primeiro item do array (que será outra pasta) e rodar essa pasta no for each para extração dos arquivos que estão dentro delas.

Quando o número de pastas a serem processadas acabar (pois teremos deletado cada uma delas do array), podemos enviar a automação para os outputs, daí também fica a critério do que for mais interessante para a usuária: nesse caso seria criar um arquivo CSV com a tabela que alimentamos com cada um daqueles 'Add Row', mas subir o datatable num banco de dados, alimentar uma aplicação web de análise de dados ou qualquer outro output.

E, esse foi **um modo** de extrair arquivos dentro de subpastas. Espero que tenha dado ideias para que você possa simplificar seu dia a dia de alguma forma. Até a próxima, happy automation!