import { IdlAccounts } from "@project-serum/anchor";
import { Todo } from "../types/todo";


export type TodoData = IdlAccounts<Todo>["todoAccount"];
export type UserProfileData = IdlAccounts<Todo>["userProfile"];