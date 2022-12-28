"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeOrgApp = void 0;
class EmployeeOrgApp {
    constructor(ceo) {
        this.undoStack = [];
        this.redoStack = [];
        this.ceo = ceo;
    }
    move(employeeID, supervisorID) {
        // Find the employee and supervisor
        const employee = this.findEmployee(this.ceo, employeeID);
        const supervisor = this.findEmployee(this.ceo, supervisorID);
        if (!employee || !supervisor) {
            throw new Error('Invalid employee or supervisor ID');
        }
        // Remove employee from current supervisor's list of subordinates
        const currentSupervisor = this.findSupervisor(this.ceo, employeeID);
        currentSupervisor.subordinates = currentSupervisor.subordinates.filter(e => e.uniqueId !== employeeID);
        // Add employee to new supervisor's list of subordinates
        supervisor.subordinates.push(employee);
        // Push action onto undo stack
        this.undoStack.push({ employeeID, supervisorID });
        // Clear redo stack
        this.redoStack = [];
    }
    undo() {
        // Pop top action off undo stack
        const action = this.undoStack.pop();
        if (!action) {
            throw new Error('No actions to undo');
        }
        // Reverse action and perform it
        const employeeID = action.employeeID;
        const supervisorID = action.supervisorID;
        this.move(employeeID, this.findSupervisor(this.ceo, employeeID).uniqueId);
        // Push action onto redo stack
        this.redoStack.push(action);
    }
    redo() {
        // Pop top action off redo stack
        const action = this.redoStack.pop();
        if (!action) {
            throw new Error('No actions to redo');
        }
        // Perform action
        const employeeID = action.employeeID;
        const supervisorID = action.supervisorID;
        this.move(employeeID, supervisorID);
        // Push action onto undo stack
        this.undoStack.push(action);
    }
    findEmployee(employee, employeeID) {
        if (employee.uniqueId === employeeID) {
            return employee;
        }
        for (const subordinate of employee.subordinates) {
            const result = this.findEmployee(subordinate, employeeID);
            if (result) {
                return result;
            }
        }
        return undefined;
    }
    findSupervisor(employee, employeeID) {
        for (const subordinate of employee.subordinates) {
            if (subordinate.uniqueId === employeeID) {
                return employee;
            }
            const result = this.findSupervisor(subordinate, employeeID);
            if (result) {
                return result;
            }
        }
        throw new Error('Employee not found');
    }
}
exports.EmployeeOrgApp = EmployeeOrgApp;
