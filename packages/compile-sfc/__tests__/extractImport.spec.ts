import { extractImport, findTheImportBoundary } from "../src/extractImport";
function createSpace(num: number) {
  return "".padEnd(num, " ");
}
describe("findTheImportBoundary", () => {
  test(`import {xxx} from '333'`, ({ meta: { name } }) => {
    expect(name.length).toMatchInlineSnapshot("23");

    expect(findTheImportBoundary(name)).toMatchInlineSnapshot(`
      [
        0,
        23,
        23,
      ]
    `);
  });
});
describe("extractImport", () => {
  let index = 0;
  test("extractImport1" + index++, () => {
    const case1 = `
import {xxx} from '111';
import {xxx} from '111';
import {xxx} from '111';

console.log("333")
const xxx = import("ddd")
import {xxx} from '111';
const xxx = "import {xxx} from '111';"
`;

    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx} from '111';",
          "import {xxx} from '111';",
          "import {xxx} from '111';",
          "import {xxx} from '111';",
        ],
        "script": "console.log(\\"333\\")
      const xxx = import(\\"ddd\\")

      const xxx = \\"import {xxx} from '111';\\"
      ",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
  import {xxx} from "333"
  import {xxx} from "333"
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx} from \\"333\\"",
          "import {xxx} from \\"333\\"
        ",
        ],
        "script": "",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
  import {xxx,
    yyy,
    zzz
  } from "@xyz/xx"
  console.log("333")
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx,
          yyy,
          zzz
        } from \\"@xyz/xx\\"",
        ],
        "script": "console.log(\\"333\\")
        ",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
  import {xxx,
    yyy,
    zzz
  } from "@xyz/xx";

  console.log("333");
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx,
          yyy,
          zzz
        } from \\"@xyz/xx\\";",
        ],
        "script": "console.log(\\"333\\");
        ",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
import {xxx,
  yyy,
  zzz
} from "@xyz/xx";

console.log("333");
console.log("333");
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx,
        yyy,
        zzz
      } from \\"@xyz/xx\\";",
        ],
        "script": "console.log(\\"333\\");
      console.log(\\"333\\");
        ",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
function (){
  import {} from ""

}
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {} from \\"\\"",
        ],
        "script": "function (){
        

      }
        ",
      }
    `);
  });
});
