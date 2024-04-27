import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Todo } from "../target/types/todo";

describe("Todo", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = provider.wallet;
  const program = anchor.workspace.Todo as Program<Todo>;

  it("Initialize a user", async () => {
    // Add your test here.
    await provider.connection.confirmTransaction(await provider.connection.requestAirdrop(user.publicKey, 10000000));

    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("USER_STATE"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )

    // const tx = await program.rpc.initializeUser({
    //   accounts: {
    //     authority: user.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     userProfile: userProfilePDA
    //   }
    // });

    const tx = await program.methods.initializeUser().accounts({
      authority: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      userProfile: userProfilePDA
    }).rpc();
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
  });

  it("Add todo", async () => { 
    // Add your test here.
    await provider.connection.confirmTransaction(await provider.connection.requestAirdrop(user.publicKey, 10000000));

    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("USER_STATE"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const userProfile = await program.account.userProfile.fetch(userProfilePDA);
    if (!userProfile) {
      throw new Error("User profile not found. Ensure it's initialized before adding a todo.");
    }

    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("TODO_STATE"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from([userProfile.lastTodo])
      ],
      program.programId
    );

    const tx = await program.methods.addTodo("My first todo").accounts({
      userProfile: userProfilePDA,
      todoAccount: todoPDA,
      systemProgram: anchor.web3.SystemProgram.programId,
      authority: user.publicKey,
    }).rpc();

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
  });

  it("Mark todo", async () => { 
    // Add your test here.
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("USER_STATE"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const userProfile = await program.account.userProfile.fetch(userProfilePDA);
    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("TODO_STATE"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from([userProfile.lastTodo - 1])
      ],
      program.programId
    );
    const firstTodo = await program.account.todoAccount.fetch(todoPDA);

    const tx = await program.methods.markTodo(firstTodo.idx).accounts({
      userProfile: userProfilePDA,
      todoAccount: todoPDA,
      systemProgram: anchor.web3.SystemProgram.programId,
      authority: user.publicKey,
    }).rpc();

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
  });

  it("Delete todo", async () => { 
    // Add your test here.
    const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("USER_STATE"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const userProfile = await program.account.userProfile.fetch(userProfilePDA);
    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("TODO_STATE"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from([userProfile.lastTodo - 1])
      ],
      program.programId
    );
    const firstTodo = await program.account.todoAccount.fetch(todoPDA);

    const tx = await program.methods.removeTodo(firstTodo.idx).accounts({
      userProfile: userProfilePDA,
      todoAccount: todoPDA,
      systemProgram: anchor.web3.SystemProgram.programId,
      authority: user.publicKey,
    }).rpc();

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
  });
});
