---
templateKey: blog-post
title: "Automação com UiPath: Controle simples de logs"
date: 2021-02-09T14:08:49.418Z
description: Uma forma simples de escrever os logs para controlar a performance
  da automação e encontrar os erros mais rapidamente.
featuredpost: true
featuredimage: /img/uipath-act-2.png
tags:
  - uipath
  - rpa
---
Uma forma muito simples de encontrar os erros da automação e descobrir qual o tempo médio de cada atividade dentro dela, é criar um arquivo txt e ir alimentando ele com os logs a cada passo da automação. Esse método pode ser redundante quando utilizamos o orchestrator, mas para quem não tem a licença, diria que é essencial. Vamos lá:

Na pasta raiz da automação, **criar uma pasta chamada logs**.

Logo no início do processo, **pegue o nome da pasta onde esta a automação** através da atividade 'Get Environment Variable':

![Atividade Uipath - Get Environment Variable ](/img/uipath-act-1.png "Atividade Uipath - Get Environment Variable ")

Em seguida, **crie uma variável para o nome do arquivo**, por exemplo:

```jsx
str_automationPath +"\logs\" + "execucao - " + Now.ToString("yyyyMMdd")
```

Crie o arquivo com a atividade 'Write Text File':

![Atividade Uipath - Write Text File](/img/uipath-act-2.png "Atividade Uipath - Write Text File")

E, a cada ponto que você achar relevante na automação, crie uma atividade de 'Append Line':

![Atividade Uipath - Append Line](/img/uipath-act-3.png "Atividade Uipath - Append Line")

Geramente eu coloco tanto a atividade de log quanto a de append line, assim enquanto estou desenvolvendo, se quero olhar rapidamente onde a automação parou, eu vejo no console, já se eu quero, por exemplo, comparar o tempo que um arquivo demorou pra ser processado na semana passada e quanto tempo uma arquivo similar demorou nessa semana, eu posso pegar os logs salvos nos txt dentro da pasta logs. Inclusive, fica ai a possibilidade de fazer uma outra automação para alimentar um banco e comparar essas performances.

Acho bacana também, se a automação tiver algum output de enviar e-mail para alguém, enviar juntamente os logs, tomando cuidado apenas para não colocar neles informações sigilosas ou até explicitas demais, como o caminho inteiro de um arquivo na rede.