export class ContactFormController {
  constructor(formEl) {
    this.form = formEl;
    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(e) {
    e.preventDefault();
    const nome = this.form.nome?.value.trim();
    const email = this.form.email?.value.trim();
    const mensagem = this.form.mensagem?.value.trim();

    if (!nome || !mensagem || !/\S+@\S+\.\S+/.test(email)) {
      return alert('Preencha todos os campos corretamente.');
    }

    alert(`Mensagem enviada!\n${nome} <${email}>\n${mensagem}`);
    this.form.reset();
  }
}
