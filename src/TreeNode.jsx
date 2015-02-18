var React = require('react'),
  TreeNodeMixin = require('./TreeNodeMixin'),
  noop = require('lodash/utility/noop');

var TreeMenu = React.createClass({

  mixins : [TreeNodeMixin],

  propTypes : {

    checkbox: React.PropTypes.bool,
    collapsible : React.PropTypes.bool,
    collapsed : React.PropTypes.bool,
    checked: React.PropTypes.bool,
    label: React.PropTypes.string,
    classNamePrefix: React.PropTypes.string,
    toggleable: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onCheckChange: React.PropTypes.func

  },

  getDefaultProps: function () {
    return {
      collapsible: true,
      checkbox : false,
      onClick: function(lineage) {
        console.log("Tree Node clicked: " + lineage.join(" > "));
      },
      onCheckChange: function (lineage) {
        console.log("Tree Node indicating a checkbox should change: " + lineage.join(" > "));
      },
      checked : false
    }
  },

  render : function () {

    var props = this.props,
      collapseNode = null,
      rootClass = this._getRootCssClass();

    if (props.collapsible) {
      var collapseClassName = rootClass + "-collapse-toggle " + props.collapsed ? "collapsed" : "expanded";
      collapseNode = <span className={collapseClassName}></span>
    }

    return (
      <div className={rootClass}>
        {collapseNode}
        {this._getLabelNode()}
        {this._getChildrenNode()}
      </div>);

  },

  _getRootCssClass: function () {
    return this.props.classNamePrefix + "-node";
  },

  _getChildrenNode: function () {

    var props = this.props;

    if (props.collapsible && props.collapsed) return null;

    //TODO - add in CSSTransitionGroup?

    return (
      <div className={this._getRootCssClass() + "-children"}>
          {props.children}
      </div>
    );

  },

  _getLabelNode: function () {

    var props = this.props,
      labelNode = <label className={props.classNamePrefix + "-node-label"}>{props.label}</label>;

    return (
      <span onClick={this._handleClick}>
        {this._getCheckboxNode()}
        {labelNode}
      </span>
    );
  },

  _getCheckboxNode: function () {
    var props = this.props;
    if (!props.checkbox) return null;

    return <input
      className={props.classNamePrefix + "-node-checkbox"}
      type="checkbox"
      checked={props.checked}
      onChange={noop}/>;
  },

  _handleClick: function (e) {
    if (this.props.checkbox) {
      return this._handleCheckChange();
    }

    this.props.onClick(this._getLineage());

  },

  _handleCheckChange: function (e) {

    this.props.onCheckChange(this._getLineage());

  },

  _getLineage: function () {

    return this.props.ancestor.concat(this.props.id);

  }

});


module.exports = TreeMenu;