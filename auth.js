// ==========================================
// FLORES PIOLI - SUPABASE AUTH
// ==========================================

const SUPABASE_URL =
    "https://tcvnebejasfjznspooho.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Ov7Yyge12AxE-etlD4VVxg_ZZTfQUlJ";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// MENSAGENS
// ==========================================

function mostrarMensagem(
    elemento,
    texto,
    tipo
) {

    if (!elemento) return;

    elemento.textContent = texto;

    elemento.className =
        "auth-message " + tipo;
}


// ==========================================
// CADASTRO
// ==========================================

const cadastroForm =
    document.getElementById(
        "cadastro-form"
    );

if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();

            const telefone =
                document
                    .getElementById("telefone")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();

            const senha =
                document
                    .getElementById("senha")
                    .value;

            const confirmarSenha =
                document
                    .getElementById(
                        "confirmar-senha"
                    )
                    .value;

            const mensagem =
                document.getElementById(
                    "cadastro-message"
                );


            if (senha !== confirmarSenha) {

                mostrarMensagem(
                    mensagem,
                    "As senhas não são iguais.",
                    "error"
                );

                return;
            }


            if (senha.length < 6) {

                mostrarMensagem(
                    mensagem,
                    "A senha precisa ter pelo menos 6 caracteres.",
                    "error"
                );

                return;
            }


            mostrarMensagem(
                mensagem,
                "Criando sua conta...",
                "info"
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signUp({

                        email: email,

                        password: senha,

                        options: {

                            data: {
                                nome: nome,
                                telefone: telefone
                            },

                            emailRedirectTo:
                                "https://xarazinho35-glitch.github.io/Site-Vendas-Futebol/login.html"

                        }

                    });


            if (error) {

                mostrarMensagem(
                    mensagem,
                    error.message,
                    "error"
                );

                return;
            }


            if (
                data.user &&
                !data.session
            ) {

                mostrarMensagem(
                    mensagem,
                    "Cadastro realizado! Verifique seu e-mail para confirmar sua conta.",
                    "success"
                );

                cadastroForm.reset();

                return;
            }


            mostrarMensagem(
                mensagem,
                "Conta criada com sucesso!",
                "success"
            );


            cadastroForm.reset();


            setTimeout(
                function () {

                    window.location.href =
                        "CoroasTradicionais.html";

                },
                1200
            );

        }
    );

}

async function reenviarConfirmacao(email) {

    const { error } =
        await supabaseClient.auth.resend({
            type: "signup",
            email: email,
            options: {
                emailRedirectTo:
                    "https://xarazinho35-glitch.github.io/Site-Vendas-Futebol/login.html"
            }
        });

    if (error) {
        alert(
            "Não foi possível reenviar o e-mail: " +
            error.message
        );

        return;
    }

    alert(
        "E-mail de confirmação reenviado! Verifique sua caixa de entrada e o spam."
    );
}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById(
        "login-form"
    );

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const senha =
                document
                    .getElementById(
                        "login-senha"
                    )
                    .value;


            const mensagem =
                document.getElementById(
                    "login-message"
                );


            mostrarMensagem(
                mensagem,
                "Entrando...",
                "info"
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email: email,
                        password: senha

                    });


            if (error) {

                mostrarMensagem(
                    mensagem,
                    "E-mail ou senha incorretos, ou a conta ainda não foi confirmada.",
                    "error"
                );

                return;
            }


            mostrarMensagem(
                mensagem,
                "Login realizado com sucesso!",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "CoroasTradicionais.html";

                },
                800
            );

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

async function logout() {

    await supabaseClient
        .auth
        .signOut();

    window.location.href =
        "CoroasTradicionais.html";
}


// ==========================================
// ATUALIZAR TOPO
// ==========================================

async function atualizarUsuarioHeader() {

    const area =
        document.getElementById(
            "user-area"
        );

    if (!area) return;


    const {
        data: { session }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        area.innerHTML = `

            <a href="login.html">
                Entrar
            </a>

            <a href="cadastro.html">
                Cadastre-se
            </a>

            <a href="#">
                Acompanhar pedido
            </a>

        `;

        return;
    }


    const user =
        session.user;


    const nome =
        user.user_metadata?.nome ||
        user.email;


    const primeiroNome =
        nome.split(" ")[0];


    area.innerHTML = `

        <span class="user-welcome">
            Olá, ${primeiroNome}
        </span>

        <a href="#" id="logout-link">
            Sair
        </a>

        <a href="meus-pedidos.html">
            Meus pedidos
        </a>

        <a href="acompanhar-pedido.html">
            Acompanhar pedido
        </a>

    `;


    document
        .getElementById(
            "logout-link"
        )
        .addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logout();

            }
        );
}


// ==========================================
// INICIAR
// ==========================================

atualizarUsuarioHeader();