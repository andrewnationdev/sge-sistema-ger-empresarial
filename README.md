# Como Instalar
- Descompactar arquivo
- Executar `npm install`
- Executar `npm run dev`

Para executar os testes, use `npx jest`. Todos devem passar.

## Configurações para Docker
Acessar MySQL:
`docker exec -it sge-db mysql -u root -p`

Ligar MySQL e contêiner
`docker start sge-db`

# Diagramas UML da Arquitetura do Sistema

## Diagrama de Classes

![Diagrama](/diagramas/diagrama_classes_sge.png)

## Diagrama de Entidade-Relacionamento

![Diagrama](/diagramas/diagrama_der.png)