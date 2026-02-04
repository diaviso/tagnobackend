"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpoolModule = void 0;
const common_1 = require("@nestjs/common");
const carpool_controller_1 = require("./carpool.controller");
const carpool_service_1 = require("./carpool.service");
const vehicles_module_1 = require("../vehicles/vehicles.module");
let CarpoolModule = class CarpoolModule {
};
exports.CarpoolModule = CarpoolModule;
exports.CarpoolModule = CarpoolModule = __decorate([
    (0, common_1.Module)({
        imports: [vehicles_module_1.VehiclesModule],
        controllers: [carpool_controller_1.CarpoolController],
        providers: [carpool_service_1.CarpoolService],
        exports: [carpool_service_1.CarpoolService],
    })
], CarpoolModule);
//# sourceMappingURL=carpool.module.js.map