#!/usr/bin/env node

import program from 'commander'
import fs from 'fs'
import json2md from 'json2md'
import pgStructure from 'pg-structure'

program
  .version('0.1.0')
  .option('-d, --database <database>', 'Database', 'localhost')
  .option('-u, --user <user>', 'User', 'postgres')
  .option('-W, --password <password>', 'Password')
  .option('-p, --port <port>', 'Port', 5432)
  .option('-h, --host <host>', 'Host', 'localhost')
  .option('-s, --schema <schema>', 'Schema', 'public')
  .parse(process.argv)

console.log(program.connection)

pgStructure(program, [program.schema])
  .then(db => {
    const markdown = []
    const schema = db.schemas.get('public')
    const tables = schema.tables

    markdown.push({ h1: 'Tables' })
    for (let [name, table] of tables) {
      markdown.push({ h2: name })
      const markdownTable = {
        headers: [
          'column',
          'comment',
          'type',
          'default',
          'constraints',
          'values'
        ],
        rows: []
      }

      for (let [name, column] of table.columns) {
        markdownTable.rows.push([
          name || '',
          column.comment || '',
          column.type || '',
          column.default || '',
          renderConstraints(column) || '',
          column.enumValues ? column.enumValues.join(', ') : ''
        ])
      }
      markdown.push({ table: markdownTable })
    }

    const output = json2md(markdown)
    fs.writeFileSync('documentation.md', `---
title: Database Documentation

search: true
---

${output}
    `)
  })

function renderConstraints(column) {
  const constraints = []

  if (!column.allowNull) {
    constraints.push('NOT NULL')
  }

  for (let [constraintName, constraint] of column.foreignKeyConstraints) {
    for (let [name, column] of constraint.columns) {
      constraints.push(`[${name}](#${constraint.referencedTable.name})`)
    }
  }

  return constraints.length && constraints.join(', ')
}
