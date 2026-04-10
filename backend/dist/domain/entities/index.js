"use strict";
// ============================================================
// Entidades del Dominio
// Representan los objetos de negocio puros, sin dependencias
// de frameworks ni bases de datos
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStatus = exports.UserRole = void 0;
// ---- Roles de Usuario ----
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["EDITOR"] = "EDITOR";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
// ---- Estado de Proyecto ----
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["PUBLISHED"] = "PUBLISHED";
    ProjectStatus["ARCHIVED"] = "ARCHIVED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
//# sourceMappingURL=index.js.map