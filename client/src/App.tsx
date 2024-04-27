import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import TodoIDL from "./utils/todo.json";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { TODO_PROGRAM_PUBKEY } from "./utils/constants";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { authorFilter } from "./utils/lib";
import { Todo } from "./types/todo";
import LoadingSpinner from "./components/LoadingSpinner";
import toast from "react-hot-toast";
import { UserProfileData } from "./utils/setup";
import { TrashIcon } from "./components/icon";

type TodoItem = {
  publicKey: string,
  account: {
    authority: string,
    idx: number,
    content: string,
    marked: boolean
  }
}

function App() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const anchorWallet = useAnchorWallet();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [todoContent, setTodoContent] = useState("");
  const [program, setProgram] = useState<anchor.Program<Todo>>();
  const [loader, setLoader] = useState({
    fetchingUser: false,
    initializeUser: false,
    all: false,
    addTodo: false,
  });


  const initializeUser = async () => {
    if (program && publicKey) {
      console.log("initializing user...");
      try {
        setLoader(prev => ({ ...prev, initializeUser: true }));
        const [profilePDA, _profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.initializeUser().accounts({
          userProfile: profilePDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        }).rpc();
        console.log(tx);
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(prev => ({ ...prev, initializeUser: false }));
      }
    } else {
      toast.error('Wallet not connected');
      console.log("program", program);
      console.log("key", publicKey);
    }
  }
  const addTodo = async () => {
    if (program && publicKey && userProfile) {
      console.log("Adding todo...");
      try {
        setLoader(prev => ({ ...prev, addTodo: true }));
        const [profilePDA, _profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const [todoPDA, _todoBump] = findProgramAddressSync([utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([userProfile.lastTodo])], program.programId)
        await program.methods.addTodo(todoContent).accounts({
          userProfile: profilePDA,
          todoAccount: todoPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        }).rpc();
        setTodos(prev => ([...prev, {
          publicKey: Date.now().toString(),
          account: {
            authority: publicKey.toBase58(),
            content: todoContent,
            idx: userProfile.lastTodo + 1,
            marked: false
          }
        }]))
        setTodoContent("");
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(prev => ({ ...prev, addTodo: false }));
      }
    } else {
      toast.error('Wallet not connected');
      console.log("program", program);
      console.log("key", publicKey);
    }
  }
  const deleteTodo = async (idx: number) => {
    if (program && publicKey && userProfile) {
      console.log("Deleting todo...");
      try {
        setLoader(prev => ({ ...prev, all: true }));
        const [profilePDA, _profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const [todoPDA, _todoBump] = findProgramAddressSync([utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([userProfile.lastTodo - 1])], program.programId)
        const firstTodo = await program.account.todoAccount.fetch(todoPDA);
        await program.methods.removeTodo(firstTodo.idx).accounts({
          userProfile: profilePDA,
          todoAccount: todoPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        }).rpc();
        setTodos(prev => prev.filter(prev => prev.account.idx !== idx));
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(prev => ({ ...prev, all: false }));
      }
    } else {
      toast.error('Wallet not connected');
      console.log("program", program);
      console.log("key", publicKey);
    }
  }
  const markTodo = async (idx: number) => {
    if (program && publicKey && userProfile) {
      console.log("Marking todo...");
      try {
        setLoader(prev => ({ ...prev, all: true }));
        const [profilePDA, _profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const [todoPDA, _todoBump] = findProgramAddressSync([utf8.encode('TODO_STATE'), publicKey.toBuffer(), Uint8Array.from([userProfile.lastTodo - 1])], program.programId)
        const firstTodo = await program.account.todoAccount.fetch(todoPDA);
        await program.methods.markTodo(firstTodo.idx).accounts({
          userProfile: profilePDA,
          todoAccount: todoPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        }).rpc();
        setTodos(prev => prev.map(prev => {
          if (prev.account.idx !== idx) {
            prev.account.marked = true;
          }
          return prev;
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(prev => ({ ...prev, all: false }));
      }
    } else {
      toast.error('Wallet not connected');
      console.log("program", program);
      console.log("key", publicKey);
    }
  }
  const findProfileAccount = async () => {
    if (program && publicKey) {
      try {
        setFetchingUser(true);
        console.log("Fetching profile account");
        const [profilePDA, _profileBump] = PublicKey.findProgramAddressSync([utf8.encode("USER_STATE"), publicKey.toBuffer()], program.programId);
        const profileAccount = await program.account.userProfile.fetch(profilePDA);

        if (profileAccount) {
          setUserProfile(profileAccount);

          // get the user's todos
          const todoAccounts: any = await program.account.todoAccount.all([authorFilter(publicKey.toString())]);
          setTodos(todoAccounts);
        }
      } catch (err) {
        console.log("No account");
        console.log(err);
      } finally {
        setFetchingUser(false);

      }
    }
  }

  useEffect(() => {
    findProfileAccount();
  }, [program]);

  useEffect(() => {
    if (!connection || !publicKey) return;

    console.log("Getting account info");
    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        console.log("account info", updatedAccountInfo);
        !isNaN(updatedAccountInfo.lamports) && setBalance(Number(updatedAccountInfo.lamports));
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then(info => {
      info && setBalance(info?.lamports as number);
    });

    // fetch user account from solana
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      const p = new anchor.Program<Todo>(TodoIDL as any, TODO_PROGRAM_PUBKEY, provider);
      setProgram(p);
    }
  }, [connection, publicKey, anchorWallet]);


  return (
    <div className="min-h-screen bg-[#161616] text-[#9aaac4]">
      <div className="max-w-6xl mx-auto py-4 px-4">
        <header className="py-4 px-4 rounded bg-[#1b1b1b] flex justify-between items-center">
          <h1 className="text-xl text-white">Solana TodoApp</h1>

          {!publicKey ?
            (
              <button onClick={() => {
                setVisible(true);
              }}>Connect</button>
            ) : (
              <button onClick={disconnect}>Disconnect</button>
            )}
        </header>

        <div className="flex justify-between items-center rounded-xl bg-[#1b1b1b] mt-2 px-4 py-2 ">
          <p className="text-[#9aaac4]">Wallet Address: <span className="font-light text-white text-sm">{publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-4)}</span></p>
          <p className="text-[#9aaac4]">Balance: <span className="font-light text-white text-sm">{publicKey ? balance / LAMPORTS_PER_SOL : 0}</span></p>
        </div>


        {
          userProfile && publicKey ?

            (
              <div className="mb-4 mt-20">
                <div className="flex items-center gap-2">
                  <input type="text" value={todoContent} onChange={(e) => setTodoContent(e.target.value)} className="bg-[#1b1b1b] text-white px-2 py-2 grow border border-transparent rounded outline-none focus:border-[#275d2b]" placeholder="A new task..." />
                  <button onClick={addTodo} className="bg-[#275d2b] text-white rounded px-4 py-2 h-fit font-light text-sm border border-[#275d2b]">{loader.addTodo ? <LoadingSpinner className="mx-auto" /> : "Add Todo"}</button>
                </div>

                <p className="px-2 text-sm py-3">You have {todos.length} todo(s)</p>

                <div className="space-y-2">
                  {todos.length ?
                    todos.slice().reverse().map(todo => {
                      return (
                        <div className="flex gap-2 justify-between items-center px-2 bg-[#1b1b1b] py-2 rounded">
                          <div className="flex gap-2 items-center">
                            <input type="checkbox" onChange={() => markTodo(todo.account.idx)} defaultChecked={todo.account.marked} disabled={todo.account.marked} className="accent-[#275d2b] mt-1" id={todo.publicKey} /><p className={`${todo.account.marked ? "line-through" : ""}`}>{todo.account.content}</p>
                          </div>
                          <button onClick={() => deleteTodo(todo.account.idx)}><TrashIcon className="w-4" /></button>
                        </div>
                      )
                    }) :
                    (
                      <div className="flex justify-center items-center min-h-[400px] mt-4">
                        <p>You have no todos</p>
                      </div>
                    )
                  }
                </div>
              </div>
            ) :

            fetchingUser ?
              (
                <div className="flex justify-center items-center min-h-[400px] mt-4">
                  <LoadingSpinner />
                </div>
              ) :

              (
                <div className="flex justify-center items-center min-h-[400px] mt-4">
                  <button onClick={initializeUser} className="bg-[#275d2b] text-white px-4 py-1 rounded min-w-[150px]">{loader.initializeUser ? <LoadingSpinner className="mx-auto" /> : "Initialize"}</button>
                </div>
              )
        }
      </div>
    </div>
  )
}

export default App;
