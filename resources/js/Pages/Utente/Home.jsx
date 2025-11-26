export default function Home() {
    return (
        <div className="p-4 text-center">
            <h1 className="text-xl font-bold">Área do Utente</h1>

            <div className="mt-4 flex flex-col gap-3">
                <a href="/utente/marcacoes" className="btn-primary">Minhas Marcações</a>
                <a href="/perfil/utente" className="btn-secondary">Meu Perfil</a>
            </div>
        </div>
    );
}
