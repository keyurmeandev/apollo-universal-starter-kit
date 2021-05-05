import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { translate } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, validate } from '@gqlapp/validation-common-react';
import { Form, RenderField, Button, Media } from '@gqlapp/look-client-react';

const postFormSchema = {
  title: [required],
  content: [required],
  image: [required]
};

const PostForm = ({ values, handleSubmit, submitting, t }) => {
  const [image, setImage] = useState();
  const handleImage = function (value, ev) {
    ev.preventDefault();
    console.log(`PostForm: handle image running`, value);
    // Assuming only image
    var file = ev.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = () => {
      let image = [reader.result];
      setImage(image);
    };
    console.log(url); // Would see a path?
    // setImage(e.target.files[0]);
  };

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
      <Media>

        <Media object data-src={image} src={image} alt="Generic" />

      </Media>
      <Field
        type="file"
        name="Image"
        component={RenderField}

        label={t('post.field.image')}
        // value={values.image}
        onChange={handleImage}
      />

      <Button color="primary" type="submit" disabled={submitting}>
        {t('post.btn.submit')}
      </Button>
    </Form>
  );
};

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  //handleImage: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  post: PropTypes.object,
  t: PropTypes.func
};

const PostFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    title: props.post && props.post.title,
    content: props.post && props.post.content,
    image: props.image && props.post.image
  }),
  validate: values => validate(values, postFormSchema),
  handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'PostForm' // helps with React DevTools
});

export default translate('post')(PostFormWithFormik(PostForm));