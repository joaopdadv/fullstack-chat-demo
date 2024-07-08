"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const Validation_1 = require("../../auth/Validation");
class UpdateUserDto extends (0, mapped_types_1.PartialType)(Validation_1.RegisterDto) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map