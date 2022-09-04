import { extractImport, findInput } from "../src/extractImport";

describe("extractImport", () => {
  let index = 0;
  test("extractImport" + index++, () => {
    const case1 = `
import {xxx} from "333"
console.log("")
`;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx} from \\"333\\"
      ",
        ],
        "script": "
      console.log(\\"\\")
      ",
      }
    `);
  });
  test("extractImport" + index++, () => {
    const case1 = `
  import {xxx} from "333"

  import {xxx} from "2"

  console.log("333")

  import {xxx} from "3"
  const xxx = 3;
  console.log("333")
  const xxx = 3;
  console.log("333")
  console.log("333")
  `;
    expect(extractImport(case1)).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import {xxx} from \\"333\\"

        ",
          "import {xxx} from \\"2\\"

        ",
          "import {xxx} from \\"3\\"
        ",
        ],
        "script": "
        console.log(\\"333\\")

        const xxx = 3;
        console.log(\\"333\\")
        const xxx = 3;
        console.log(\\"333\\")
        console.log(\\"333\\")
        ",
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
        } from \\"@xyz/xx\\"
        ",
        ],
        "script": "
        console.log(\\"333\\")
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
        } from \\"@xyz/xx\\";

        ",
        ],
        "script": "
        console.log(\\"333\\");
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
      } from \\"@xyz/xx\\";

      ",
        ],
        "script": "
      console.log(\\"333\\");
      console.log(\\"333\\");
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
    expect(findInput(case1)).toMatchInlineSnapshot(`
      [
        {
          "code": "import {xxx,
        yyy,
        zzz
      } from \\"@xyz/xx\\";

      ",
          "end": 46,
          "imports": "{xxx,
        yyy,
        zzz
      } ",
          "specifier": "@xyz/xx",
          "start": 1,
          "type": "static",
        },
      ]
    `);
  });
});
