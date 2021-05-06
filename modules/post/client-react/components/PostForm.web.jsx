import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { translate } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, validate } from '@gqlapp/validation-common-react';
import { Form, RenderField, Media, Button, Table, Alert } from '@gqlapp/look-client-react';
import { FormGroup, Label, Input } from 'reactstrap';

const postFormSchema = {
  title: [required],
  content: [required],
  image: [required],
  file: [required]
};

const PostForm = ({ values, handleSubmit, setFieldValue, submitting, t }) => {
  const [image, setImage] = useState(values.image ? `/public/post/${values.image}` : null);

  const handleImage = function(ev) {
    ev.preventDefault();
    // Assuming only image
    var file = ev.target.files[0];
    setFieldValue(`file`, file);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let image = [reader.result];
      setImage(image);
    };
  };

  console.log(values,image);
  return (
    <Form name="post" onSubmit={handleSubmit}>
      <Field name="title" component={RenderField} type="text" label={t('post.field.title')} value={values.title} />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label={t('post.field.content')}
        value={values.content}
      />
      <div style={{ height: '200px' }}>
        <Media object data-src={image} src={image} alt="Generic" style={{ height: '100%' }} />
      </div>

      <FormGroup>
        <Label for="exampleFile">Image</Label>
        <Input type="file" accept="image/*" name="image" id="image" onChange={handleImage} value={values.image} />
      </FormGroup>
      <Button color="primary" type="submit" disabled={submitting}>
        {t('post.btn.submit')}
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  post: PropTypes.object,
  t: PropTypes.func
};

const PostFormWithFormik = withFormik({
  initialValues: { file: null },
  mapPropsToValues: props => ({
    title: props.post && props.post.title,
    content: props.post && props.post.content,
    image: props.image && props.post.image,
    file: null
  }),
  validate: values => {
    validate(values, postFormSchema);
  },
  handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    onSubmit({ title: values.title, content: values.content, image: values.file });
  },
  enableReinitialize: true,
  displayName: 'PostForm' // helps with React DevTools
});

export default translate('post')(PostFormWithFormik(PostForm));
