import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faGlobe, faSitemap, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import CardItemRelation from './CardItemRelation';
import CardItemType from './CardItemType';
import Wrapper from './Wrapper';
import { isNil, get, find, upperFirst } from 'lodash';
import pluginId from '../../pluginId';
import { navigationItemType } from '../../containers/View/utils/enums';
import { extractRelatedItemLabel, isRelationCorrect, isRelationPublished } from '../../containers/View/utils/parsers';
import CardItemError from './CardItemError';
import CardItemRelationStatus from './CardItemRelationStatus';

const ItemFooter = ({ type, removed, relatedRef, relatedType, attachButtons, contentTypesNameFields, contentTypes }) => {
  const { formatMessage } = useIntl();

  const isRelationDefined = !isNil(relatedRef);


  const formatRelationType = () =>
  isRelationDefined ? get(relatedRef, 'labelSingular', get(relatedRef, '__contentType')) : '';

  const formatRelationName = () =>
  isRelationDefined ? extractRelatedItemLabel(relatedRef, contentTypesNameFields) : '';

  const isSingle = get(relatedRef, 'isSingle', false);
  const relatedContentType = isRelationDefined && isSingle ? find(contentTypes, cnt => cnt.uid === relatedType) : undefined;

  return (
    <Wrapper removed={removed} attachButtons={attachButtons}>
      <CardItemType>
        <FontAwesomeIcon
          icon={type === navigationItemType.EXTERNAL ? faGlobe : faSitemap}
        />{' '}
        {upperFirst(type.toLowerCase())}
      </CardItemType>
      {isRelationCorrect({ type, related: relatedRef }) && (
        <CardItemRelation title={formatRelationName()}>
          <FontAwesomeIcon icon={faLink} />{' '}
          {isSingle ? formatRelationType() : `(${formatRelationType()}) ${formatRelationName()}`}
          { !isRelationPublished({ relatedRef, relatedType: relatedContentType, type, isCollection: !isNil(relatedContentType) }) && (
          <CardItemRelationStatus>
            { `${formatMessage({
              id: `${pluginId}.notification.navigation.item.relation.status.draft`,
            })}` }
          </CardItemRelationStatus>
          ) }
        </CardItemRelation>
      )}
      { !isRelationCorrect({ type, related: relatedRef }) && (
        <CardItemError title={formatRelationName()}>
          <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
          { formatMessage({
              id: `${pluginId}.notification.navigation.item.relation`,
            }) }
        </CardItemError>
      )}
    </Wrapper>
  );
};

ItemFooter.propTypes = {
  type: PropTypes.string.isRequired,
  contentTypesNameFields: PropTypes.object.isRequired,
  menuAttached: PropTypes.bool,
  removed: PropTypes.bool,
  relatedRef: PropTypes.object,
  attachButtons: PropTypes.bool,
};

export default ItemFooter;
