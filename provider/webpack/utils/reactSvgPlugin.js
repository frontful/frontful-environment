function cssToObj(css) {
  let o = {}
  let elements = css.split(';')
  elements
    .filter(el => !!el)
    .forEach(el => {
      let s = el.split(':'),
        key = s.shift().trim(),
        value = s.join(':').trim()
      o[key] = value
    })
  return o
}

function hyphenToCamel(name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

function namespaceToCamel(namespace, name) {
  return namespace + name.charAt(0).toUpperCase() + name.slice(1)
}

module.exports = function (babel) {
  const t = babel.types

  const attrVisitor = {
    JSXAttribute(path) {
      if (t.isJSXNamespacedName(path.node.name)) {
        path.node.name = t.jSXIdentifier(
          namespaceToCamel(path.node.name.namespace.name, path.node.name.name.name)
        )
      } else if (t.isJSXIdentifier(path.node.name)) {
        if (path.node.name.name === 'class') {
          path.node.name.name = "className"
        }

        if (path.node.name.name === 'style') {
          let csso = cssToObj(path.node.value.value)
          let properties = Object.keys(csso).map(prop => t.objectProperty(
            t.identifier(hyphenToCamel(prop)),
            t.stringLiteral(csso[prop])
          ))
          path.node.value = t.jSXExpressionContainer(
            t.objectExpression(properties)
          )
        }

        if (path.node.name.name.indexOf('data-') !== 0) {
          path.node.name.name = hyphenToCamel(path.node.name.name)
        }
      }
    }
  }

  const getExport = function (svg, className = 'SVG') {
    return t.exportDefaultDeclaration(
      t.classDeclaration(
        t.identifier(className),
        t.memberExpression(
          t.identifier('React'),
          t.identifier('Component')
        ),
        t.classBody(
          [
            t.classMethod(
              'method',
              t.identifier('render'),
              [],
              t.blockStatement(
                [t.returnStatement(svg)]
              )
            )
          ]
        ),
        []
      )
    )
  }

  const svgVisitor = {
    JSXOpeningElement(path) {
      if (path.node.name.name.toLowerCase() === 'svg') {
        path.node.attributes.push(
          t.jSXSpreadAttribute(
            t.memberExpression(
              t.thisExpression(),
              t.identifier('props')
            )
          )
        )
      }
    }
  }

  const svgExpressionVisitor = {
    ExpressionStatement(path) {
      if (!path.get('expression').isJSXElement()) return
      if (path.get('expression.openingElement.name').node.name !== 'svg') return
      path.replaceWith(getExport(path.get('expression').node))
    }
  }

  const programVisitor = {
    Program(path) {
      path.node.body.unshift(
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier('React'))],
          t.stringLiteral('react')
        )
      )
    }
  }

  return {
    visitor: Object.assign({}, programVisitor, svgExpressionVisitor, svgVisitor, attrVisitor)
  }
}
