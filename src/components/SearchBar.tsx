import React, { memo, useEffect } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { InfiniteData, QueryObserverResult, RefetchOptions } from 'react-query';

import { GetProductsBySearchTermOutput } from '@interfaces/product.interface';

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  refetch(options?: RefetchOptions): Promise<QueryObserverResult<InfiniteData<GetProductsBySearchTermOutput>, Error>>;
}

const SearchBar = ({ query, setQuery, refetch }: SearchBarProps) => {
  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [refetch, query]);

  const initialValues = {
    query: '',
  };

  const validationSchema = Yup.object().shape({
    query: Yup.string(),
  });

  const handleGetProductsBySearchTerm = async (values, setSubmitting) => {
    setSubmitting(false);
    console.log(values.query);
    setQuery(values.query);
  };

  return (
    <Formik
      initialValues={initialValues} //
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={(values, { setSubmitting }) => handleGetProductsBySearchTerm(values, setSubmitting)}
    >
      {({ values, handleChange }) => (
        <Form className="flex justify-center">
          <input //
            type="text"
            name="query"
            value={values.query}
            onChange={handleChange}
            placeholder="Search"
            className="w-full font-semibold text-base bg-gray-200 rounded-2xl m-4 p-3"
          />
        </Form>
      )}
    </Formik>
  );
};

export default memo(SearchBar);
