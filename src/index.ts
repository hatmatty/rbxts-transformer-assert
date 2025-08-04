import ts from "typescript";

export default function (): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    const { factory } = context;

    function visitor(node: ts.Node): ts.Node {
      // Early exit for nodes that can't contain assert statements
      if (
        ts.isTypeNode(node) ||
        ts.isImportDeclaration(node) ||
        ts.isExportDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)
      ) {
        return node;
      }

      // target only standalone `assert(a, b)` statements
      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === "assert" &&
        node.expression.arguments.length === 2
      ) {
        const [condition, message] = node.expression.arguments;

        // build `if (!condition) { throw message; }`
        const negated = factory.createPrefixUnaryExpression(
          ts.SyntaxKind.ExclamationToken,
          condition
        );
        const throwStmt = factory.createThrowStatement(message);
        const block = factory.createBlock([throwStmt], /*multiLine*/ true);
        return factory.createIfStatement(negated, block);
      }

      // otherwise, keep recursing
      return ts.visitEachChild(node, visitor, context);
    }

    return (sourceFile) => ts.visitNode(sourceFile, visitor, ts.isSourceFile);
  };
}
