import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import useI18n from "../../hook/usei18n";
// import ImageFilter from "react-image-filter";

const FilterWidget: React.FC = () => {
  const { getTranslation } = useI18n();
  return(
    <Col>
      <Form>
        <Form.Group className="mb-3" controlId="iconKeyword">
          {/* <ImageFilter
            image='https://source.unsplash.com/random/1200x800'
            filter={ "duotone" } // see docs beneath
            colorOne={ [40, 250, 250] }
            colorTwo={ [250, 150, 30] }
          /> */}
        </Form.Group>
      </Form>
    </Col>
  );  
};

export default FilterWidget;
