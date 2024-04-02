# Available Steps

See the alias.json file to map your alis with a selector.

## Given

All the Given steps.

### Logged User {user} {password} and selected org {organization name}

| var               | type     | description          |
|-------------------|----------|----------------------|
| user              | `string` | username of the user |
| password          | `string` | password of the user |
| organization name | `string` | organization name    |

## When

All the When steps.

### the client goes to {url}

| var | type     | description |
|-----|----------|-------------|
| url | `string` | an URL      |

### types {text} on {input text}

| var        | type     | description                        |
|------------|----------|------------------------------------|
| text       | `string` | the text to write                  |
| input text | `string` | an alias for an input text element |

### clicks on {html element}

| var          | type     | description                 |
|--------------|----------|-----------------------------|
| html element | `string` | an alias for a HTML element |

### fills the form  < table >

| var   | type        | description                                       |
|-------|-------------|---------------------------------------------------|
| table | `dataTable` | a table with the input text alias and them values |

### selects for {select} the value {option}

| var    | type     | description                    |
|--------|----------|--------------------------------|
| select | `string` | an alias for a select element  |
| option | `string` | an alias for an option element |

### types and selects for {filter} the value {option}

### types {text} in {filter} and selects the value {option}

| var    | type     | description                                 |
|--------|----------|---------------------------------------------|
| text   | `string` | some text to type                           |
| filter | `string` | an alias for a filtering input text element |
| option | `string` | an alias for an option element              |

## Then

All the Then steps.

### element {alias} has {value} as value

| var   | type     | description                 |
|-------|----------|-----------------------------|
| alias | `string` | an alias for a HTML element |
| value | `string` | some text                   |

### element {alias} exists

| var   | type     | description                 |
|-------|----------|-----------------------------|
| alias | `string` | an alias for a HTML element |

### text {string} exists in the page

| var  | type     | description                  |
|------|----------|------------------------------|
| text | `string` | some text exists in the page |

### {alias} is disabled

| var   | type     | description                 |
|-------|----------|-----------------------------|
| alias | `string` | an alias for a HTML element |
