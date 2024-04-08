"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var system_1 = require("@mui/system");
var mui_italia_1 = require("@pagopa/mui-italia");
var react_1 = require("@testing-library/react");
var react_router_dom_1 = require("react-router-dom");
var store_1 = require("../../../redux/store");
var react_redux_1 = require("react-redux");
var react_2 = require("react");
var DelegationsPage_1 = require("../DelegationsPage");
beforeEach(function () {
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
afterEach(react_1.cleanup);
describe('<DelegationsPage />', function () {
    test('render component DelegationsPage', function () { return __awaiter(void 0, void 0, void 0, function () {
        var downloadCSVButton, alertTest, buttonGotIt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_1.render)(<react_redux_1.Provider store={store_1.store}>
        <react_router_dom_1.MemoryRouter initialEntries={["/delegations-list"]}>
          <react_router_dom_1.Route path="/delegations-list">
            <system_1.ThemeProvider theme={mui_italia_1.theme}>
              <DelegationsPage_1.default />
            </system_1.ThemeProvider>
          </react_router_dom_1.Route>
        </react_router_dom_1.MemoryRouter>
      </react_redux_1.Provider>);
                    expect(react_1.screen.queryByTestId('alert-test')).not.toBeInTheDocument();
                    downloadCSVButton = react_1.screen.getByTestId('download-list-button');
                    react_1.fireEvent.click(downloadCSVButton);
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            alertTest = react_1.screen.queryByTestId('alert-test');
                            expect(alertTest).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    buttonGotIt = react_1.screen.getByTestId('got-it-button');
                    react_1.fireEvent.click(buttonGotIt);
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            expect(alertTest).not.toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('render component DelegationsPage with mocked time', function () { return __awaiter(void 0, void 0, void 0, function () {
        var downloadCSVButton, alertTest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.setSystemTime(new Date(2020, 3, 1, 5, 5));
                    (0, react_1.render)(<react_redux_1.Provider store={store_1.store}>
        <react_router_dom_1.MemoryRouter initialEntries={["/delegations-list"]}>
          <react_router_dom_1.Route path="/delegations-list">
            <system_1.ThemeProvider theme={mui_italia_1.theme}>
              <DelegationsPage_1.default />
            </system_1.ThemeProvider>
          </react_router_dom_1.Route>
        </react_router_dom_1.MemoryRouter>
      </react_redux_1.Provider>);
                    expect(react_1.screen.queryByTestId('alert-test')).not.toBeInTheDocument();
                    downloadCSVButton = react_1.screen.getByTestId('download-list-button');
                    react_1.fireEvent.click(downloadCSVButton);
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            alertTest = react_1.screen.queryByTestId('alert-test');
                            expect(alertTest).toBeInTheDocument();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
