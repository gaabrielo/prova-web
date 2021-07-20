import { useState, useEffect } from "react";
import db from "./firebase";

import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { CustomModal } from "./CustomModal";

import styles from "./App.module.scss";

function App() {
  const [institutions, setInstitutions] = useState();
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isInstitutionEditing, setIsInstitutionEditing] = useState(false);
  const [institutionEditingId, setInstitutionEditingId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const initialInstitutionState = {
    id: null,
    name: "",
    abbreviation: "",
    document: "",
    email: "",
    tel: "",
    password: "",
    updatedAt: "",
    createdAt: "",
  };
  const [institutionForm, setInstitutionForm] = useState(
    initialInstitutionState
  );
  const [institutionBeingEdited, setInstitutionBeingEdited] = useState(
    initialInstitutionState
  );
  const [passwordModal, setPasswordModal] = useState("");

  useEffect(() => {
    db.child("institutions").on("value", (snapshot) => {
      if (snapshot.val() != null) setInstitutions({ ...snapshot.val() });
    });
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInstitutionForm({ ...institutionForm, [name]: value });
  }

  function saveInstitution(event) {
    setValidated(false);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    var formData = {
      name: institutionForm.name,
      abbreviation: institutionForm.abbreviation,
      document: institutionForm.document,
      email: institutionForm.email,
      tel: institutionForm.tel,
      password: institutionForm.password,
    };

    if (
      formData.name === "" ||
      formData.document === "" ||
      formData.email === "" ||
      formData.tel === "" ||
      formData.password === ""
    ) {
      return;
    }

    db.child("institutions").push(formData, (err) => {
      if (err) console.log(err);
    });
  }

  function passwordModalVerification(id, institution) {
    if (submitted) {
      setSubmitted(false);
    }
    if (deleted) {
      setDeleted(false);
    }

    setInstitutionBeingEdited({
      id: id,
      name: institution.name,
      abbreviation: institution.abbreviation ? institution.abbreviation : "",
      document: institution.document,
      email: institution.email,
      tel: institution.tel,
      password: institution.password,
    });

    setInstitutionEditingId(id);

    setModalShow(true);
  }

  function editInstitution(id, institution) {
    if (institution.password !== passwordModal) {
      setPasswordModal("");
      setModalShow(false);
      setInstitutionForm(initialInstitutionState);
      alert("Senha incorreta");
      setInstitutionEditingId(null);
      setIsInstitutionEditing(false);
      setInstitutionBeingEdited(initialInstitutionState);
      return;
    }

    setPasswordModal("");
    setModalShow(false);
    setInstitutionEditingId(id);
    setIsInstitutionEditing(true);
    setInstitutionForm(institutionBeingEdited);
  }

  function stopEditInstitution() {
    setInstitutionForm(initialInstitutionState);
    setInstitutionBeingEdited(initialInstitutionState);
    setInstitutionEditingId(null);
    setIsInstitutionEditing(false);
  }

  function saveEdit() {
    var formData = {
      name: institutionForm.name,
      abbreviation: institutionForm.abbreviation,
      document: institutionForm.document,
      email: institutionForm.email,
      tel: institutionForm.tel,
      password: institutionForm.password,
    };

    if (
      formData.name === "" ||
      formData.document === "" ||
      formData.email === "" ||
      formData.tel === "" ||
      formData.password === ""
    ) {
      alert("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    db.child(`institutions/${institutionEditingId}`).set(formData, (err) => {
      if (err) console.log(err);
      else return stopEditInstitution();
    });
  }

  function deleteInstitution() {
    if (
      window.confirm(
        `Tem certeza que gostaria de deletar a instituição ${institutionBeingEdited.name}?`
      )
    ) {
      db.child(`institutions/${institutionEditingId}`).remove((err) => {
        if (err) console.log(err);
        else return stopEditInstitution();
      });
    }
  }

  return (
    <div className={styles.institutionsContainer}>
      <CustomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalTitle={institutionBeingEdited.name}
      >
        <Form.Group>
          <Form.Label>
            <p>Insira a senha da instituição para editá-la</p>
            Senha <b style={{ color: "var(--red)" }}>*</b>
          </Form.Label>
          <Form.Control
            type="password"
            name="passwordModal"
            required
            value={passwordModal}
            onChange={(event) => setPasswordModal(event.target.value)}
          />
        </Form.Group>
        <Row>
          <Col style={{ "margin-top": "1rem" }}>
            <Button
              variant="primary"
              type="button"
              style={{ width: "100%" }}
              onClick={() =>
                editInstitution(institutionEditingId, institutionBeingEdited)
              }
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </CustomModal>
      {submitted ? (
        <h1
          className={
            deleted
              ? [styles.deletedStyle, styles.submittedTitle].join(" ")
              : styles.submittedTitle
          }
        >
          {deleted ? "Instituição deletada!" : "Enviado com sucesso!"}
        </h1>
      ) : (
        <section className={styles.form}>
          <h2>
            {isInstitutionEditing
              ? "Editar instituição"
              : "Cadastrar instituição"}
          </h2>
          <Form noValidate validated={validated} onSubmit={saveInstitution}>
            <Form.Group as={Row} controlId="name">
              <Form.Label column sm={3}>
                Nome da instituição <b>*</b>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="name"
                  type="text"
                  required
                  value={institutionForm.name}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="abbreviation">
              <Form.Label column sm={3}>
                Sigla
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  name="abbreviation"
                  type="text"
                  value={institutionForm.abbreviation}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="doc">
              <Form.Label column sm={3}>
                CNPJ <b>*</b>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="document"
                  required
                  value={institutionForm.document}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="email">
              <Form.Label column sm={3}>
                E-mail <b>*</b>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="email"
                  required
                  value={institutionForm.email}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="tel">
              <Form.Label column sm={3}>
                Telefone <b>*</b>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="tel"
                  name="tel"
                  required
                  value={institutionForm.tel}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="password">
              <Form.Label column sm={3}>
                Senha <b>*</b>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  value={institutionForm.password}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Row className="align-items-center">
              {isInstitutionEditing ? (
                <>
                  <Col sm={{ span: "auto", offset: 3 }} xs={{ offset: 0 }}>
                    <Button type="button" onClick={() => saveEdit()}>
                      Salvar alterações
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => stopEditInstitution()}
                    >
                      Cancelar edição
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-danger"
                      type="button"
                      onClick={() => deleteInstitution()}
                    >
                      Deletar
                    </Button>
                  </Col>
                </>
              ) : (
                <Col sm={{ span: 9, offset: 3 }}>
                  <Button type="submit">Enviar</Button>
                </Col>
              )}
            </Row>
          </Form>
        </section>
      )}
      <section className={styles.listOfInstitutions}>
        <h2>Instituições</h2>
        <Table>
          <thead>
            <tr>
              <th className={styles.abbreviation}>Sigla</th>
              <th>Nome da instituição</th>
              <th className={styles.doc}>CNPJ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {institutions &&
              Object.keys(institutions).map((id) => (
                <tr key={id}>
                  <td className={styles.abbreviation}>
                    {institutions[id].abbreviation
                      ? institutions[id].abbreviation
                      : "—"}
                  </td>
                  <td>{institutions[id].name}</td>
                  <td className={styles.doc}>{institutions[id].document}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        passwordModalVerification(id, institutions[id])
                      }
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}

export default App;
