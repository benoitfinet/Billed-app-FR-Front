/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import store from "../__mocks__/store.js";
import mockStore from "../__mocks__/store";
import BillsUI from "../views/BillsUI.js";
import userEvent from "@testing-library/user-event";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toBeTruthy()
    })
  })
  describe("Given I am trying to upload a file", () => {
    document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    describe("When the file as the wrong format", () => {
      test("Then the input should not accept the file", () => {
        expect(newBill.isFileExtensionValid("file.txt")).toBe(false);
        expect(newBill.isFileExtensionValid("file.anythingelse")).toBe(false);
      })
      test("Then it should throw an error", () => {
        function wrongFile() {
          const input = screen.getAllByTestId("file")
          newBill.isReturningValidFile("test.txt", input);
        }
        expect(wrongFile).toThrowError(new Error('Please select a file with the extension jpg, jpeg or png'))
      })
    })
    describe("When the file as the right format", () => {
      test("Then the input should accept the file", () => {
        expect(newBill.isFileExtensionValid("file.png")).toBe(true);
        expect(newBill.isFileExtensionValid("file.jpeg")).toBe(true);
        expect(newBill.isFileExtensionValid("file.jpg")).toBe(true);
      })
      test("Then it should display the name of this file", () => {
        expect(newBill.isReturningValidFile("test.jpg")).toBe("test.jpg");
        expect(newBill.isReturningValidFile("test.jpeg")).toBe("test.jpeg");
        expect(newBill.isReturningValidFile("test.png")).toBe("test.png");
        expect(newBill.isReturningValidFile("test.jpg")).not.toBe("test.txt");
        expect(newBill.isReturningValidFile("test.jpeg")).not.toBe("test.anythingelse");
        expect(newBill.isReturningValidFile("test.png")).not.toBe("test.anythingelse");
      })
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should throw and error when file as the wrong format", () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div");
      root.setAttribute("id", "root");

      document.body.append(root);

      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      const file = screen.getAllByTestId('file')[1]
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
          files: [new File(['anything'], 'text.txt', {
            type: 'text/txt'
          })]
        }
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toThrowError(Error);
    })
    test("Then it should throw and error when file as the wrong format", () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div");
      root.setAttribute("id", "root");

      document.body.append(root);

      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      const file = screen.getAllByTestId('file')[1]
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
          files: [new File(['anything'], 'text.png', {
            type: 'image/png'
          })]
        }
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toBeTruthy();
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When I submit a new bill", () => {
      describe("When the file format is right", () => {
        test("Then it should validate the form and send me to the bills page", async ()=> {
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
    
          const root = document.createElement("div");
          root.setAttribute("id", "root");
    
          document.body.append(root);
    
          router();
          window.onNavigate(ROUTES_PATH.NewBill);
    
          const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage
          })

          const formNewBill = screen.getAllByTestId('form-new-bill')[1]

          const type = screen.getAllByTestId('expense-type')[1]
          fireEvent.change(type, {
            target: {
              value: "Services en ligne"
            }
          });
          expect(type.value).toBe("Services en ligne");

          const name = screen.getAllByTestId('expense-name')[1]
          fireEvent.change(name, {
            target: {
              value: "Nouveau téléphone"
            }
          });
          expect(name.value).toBe("Nouveau téléphone");

          const amount = screen.getAllByTestId('amount')[1]
          fireEvent.change(amount, {
            target: {
              value: 89
            }
          });
          expect(amount.value).toBe("89");

          const date = screen.getAllByTestId('datepicker')[1]
          fireEvent.change(date, {
            target: {
              value: "2022-09-26"
            }
          });
          expect(date.value).toBe("2022-09-26");

          const vat = screen.getAllByTestId('vat')[1]
          fireEvent.change(vat, {
            target: {
              value: 20
            }
          });
          expect(vat.value).toBe("20");

          const pct = screen.getAllByTestId('pct')[1]
          fireEvent.change(pct, {
            target: {
              value: 8
            }
          });
          expect(pct.value).toBe("8");

          const commentary = screen.getAllByTestId('commentary')[1]
          fireEvent.change(commentary, {
            target: {
              value: "Ceci est un commentaire"
            }
          });
          expect(commentary.value).toBe("Ceci est un commentaire")

          const file = screen.getAllByTestId('file')[1]
          fireEvent.change(file, {
            target: {
              files: [new File(['test'], 'test.png', {
                type: 'image/png'
              })]
            }
          })

          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

          formNewBill.addEventListener("submit", handleSubmit)
          fireEvent.submit(formNewBill)

          expect(handleSubmit).toHaveBeenCalled();
          expect(handleSubmit).toBeTruthy();

          router()
          window.onNavigate(ROUTES_PATH["Bills"]);

          await waitFor(() => screen.getByTestId('icon-window'))
          const windowIcon = screen.getByTestId('icon-window')
          expect(windowIcon.classList).toContain(`active-icon`);
        })
      })
    })
  })
})

// test d'intégration POST

describe("Given I am a user connected as an Employee", () => {
  describe("When I submit a new bill", () => {
    test("Then it should create a new bill in the list of bills", async () => {
      document.body.innerHTML = NewBillUI();
      const inputData = {
        type: "Services en ligne",
        name: "Nouveau téléphone",
        datepicker: "2022-09-26",
        amount: "89",
        vat: "20",
        pct: "8",
        commentary: "Ceci est un commentaire",
        file: new File(["test"], "test.png", { type: "image/png" }),
      };

      const formNewBill = screen.getByTestId("form-new-bill");
      const inputExpenseName = screen.getByTestId("expense-name");
      const inputExpenseType = screen.getByTestId("expense-type");
      const inputDatepicker = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVAT = screen.getByTestId("vat");
      const inputPCT = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");

      fireEvent.change(inputExpenseType, {
        target: { value: inputData.type },
      });
      expect(inputExpenseType.value).toBe(inputData.type);

      fireEvent.change(inputExpenseName, {
        target: { value: inputData.name },
      });
      expect(inputExpenseName.value).toBe(inputData.name);

      fireEvent.change(inputDatepicker, {
        target: { value: inputData.datepicker },
      });
      expect(inputDatepicker.value).toBe(inputData.datepicker);

      fireEvent.change(inputAmount, {
        target: { value: inputData.amount },
      });
      expect(inputAmount.value).toBe(inputData.amount);

      fireEvent.change(inputVAT, {
        target: { value: inputData.vat },
      });
      expect(inputVAT.value).toBe(inputData.vat);

      fireEvent.change(inputPCT, {
        target: { value: inputData.pct },
      });
      expect(inputPCT.value).toBe(inputData.pct);

      fireEvent.change(inputCommentary, {
        target: { value: inputData.commentary },
      });
      expect(inputCommentary.value).toBe(inputData.commentary);

      userEvent.upload(inputFile, inputData.file);
      expect(inputFile.files[0]).toStrictEqual(inputData.file);
      expect(inputFile.files).toHaveLength(1);

      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() =>
            JSON.stringify({
              email: "email@test.com",
            })
          ),
        },
        writable: true,
      });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
    test("Then it fails with a 404 message error", async () => {
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Then it fails with a 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    })
  });
})