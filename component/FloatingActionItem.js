import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, Image, View, Animated } from 'react-native'

import { getTouchableComponent } from './utils/touchable'

const DEFAULT_MARGIN = 8

class FloatingActionItem extends Component {
  constructor(props) {
    super(props)

    this.animation = new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      Animated.spring(this.animation, {
        toValue: nextProps.active ? 1 : 0
      }).start()
    }
  }

  handleOnPress = () => {
    const { name, onPress } = this.props

    onPress(name)
  }

  renderText() {
    const {
      // @deprecated in favor of textElevation
      elevation, // eslint-disable-line
      text,
      position,
      textElevation,
      textBackground,
      textColor
    } = this.props

    if (elevation !== undefined) {
      console.warn(
        'FloatingActionItem: "elevation" property was deprecated. Please use "textElevation"'
      )
    }

    if (text) {
      return (
        <View
          key="text"
          style={[
            styles.textContainer,
            styles[`${position}TextContainer`],
            {
              backgroundColor: textBackground,
              elevation: textElevation || elevation
            }
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: textColor
              }
            ]}
          >
            {text}
          </Text>
        </View>
      )
    }

    return null
  }

  renderButton() {
    const { icon, color, customIconStyle } = this.props

    let iconStyle

    if (icon && icon.uri) {
      iconStyle = styles.iconLogo
    } else {
      iconStyle = styles.icon
    }

    return (
      <View key="button" style={[styles.button, { backgroundColor: color }]}>
        {React.isValidElement(icon) ? (
          icon
        ) : (
          <Image style={[iconStyle,customIconStyle]} source={icon} />
        )}
      </View>
    )
  }

  render() {
    const { position, distanceToEdge, paddingTopBottom } = this.props
    const Touchable = getTouchableComponent(false)

    const animatedActionContainerStyle = {
      marginBottom: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 10]
      })
    }

    const components = []
    const distanceToEdgeActionContainer = {}

    if (position === 'left') {
      components.push(this.renderButton())
      components.push(this.renderText())
      distanceToEdgeActionContainer.paddingLeft =
        distanceToEdge + DEFAULT_MARGIN
    } else if (position === 'right') {
      components.push(this.renderText())
      components.push(this.renderButton())
      distanceToEdgeActionContainer.paddingRight =
        distanceToEdge + DEFAULT_MARGIN
    } else {
      components.push(this.renderButton())
    }

    return (
      <Touchable
        activeOpacity={0.4}
        style={styles.container}
        onPress={this.handleOnPress}
      >
        <Animated.View
          style={[
            styles.actionContainer,
            animatedActionContainerStyle,
            styles[`${position}ActionContainer`],
            distanceToEdgeActionContainer,
            {
              paddingTop: paddingTopBottom,
              paddingBottom: paddingTopBottom
            }
          ]}
        >
          {components}
        </Animated.View>
      </Touchable>
    )
  }
}

FloatingActionItem.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.any,
  name: PropTypes.string.isRequired,
  text: PropTypes.string,
  textBackground: PropTypes.string,
  textColor: PropTypes.string,
  // not on doc
  textElevation: PropTypes.number,
  // not modified by user
  position: PropTypes.oneOf(['left', 'right', 'center']),
  active: PropTypes.bool,
  distanceToEdge: PropTypes.number,
  paddingTopBottom: PropTypes.number, // modified by parent property "actionsPaddingTopBottom"
  onPress: PropTypes.func
}

FloatingActionItem.defaultProps = {
  color: '#1253bc',
  distanceToEdge: 30,
  textElevation: 5,
  textColor: '#ffffff'
}

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    flex: 1,
    flexDirection: 'column'
  },
  actionContainer: {
    elevation: 0,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    paddingTop: 8,
    marginRight: -8
  },
  centerActionContainer: {
    paddingLeft: 10,
    paddingRight: 10
  },
  textContainer: {
    // paddingHorizontal: 8,
    // shadowOpacity: 0.35,
    // shadowOffset: {
    //   width: 0,
    //   height: 5
    // },
    //shadowColor: '#000000',
    //shadowRadius: 3,
    // elevation: 5,
    // borderRadius: 4,
    height: 22,
    marginTop: 18
  },
  leftTextContainer: {
    marginLeft: 14
  },
  rightTextContainer: {
    marginRight: 14
  },
  text: {
    fontSize: 14,
    lineHeight: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 30,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000000',
    shadowRadius: 3,
    elevation: 5
  },
  iconLogo: {
    resizeMode: 'cover',
    width: 65,
    height: 65,
    borderRadius: 30
  },
  icon: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
    marginTop: 3
  }
})

export default FloatingActionItem
