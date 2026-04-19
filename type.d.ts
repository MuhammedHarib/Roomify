interface AuthState {
    isSignedIn : boolean,
    userName: string | boolean | null,
    userId: string | boolean | null,
}

type AuthContext = {
    isSignedIn : boolean,
    userName: string | boolean | null,
    userId: string | boolean | null,
    refreshAuth :()=> Promise<boolean>;
    signIn :()=> Promise<boolean>;
    signOut :()=> Promise<boolean>;

} 