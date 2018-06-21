// @flow

import type { AbcSpendTarget, EdgeMetadata, EdgeParsedUri, EdgeSpendInfo, EdgeTransaction } from 'edge-core-js'

import { STANDARD_FEE } from '../../../../constants/indexConstants'
import type { State } from '../../../ReduxTypes'
import { getSceneState, getSelectedCurrencyCode } from '../../selectors.js'

export type GuiMakeSpendInfo = {
  currencyCode?: string,
  networkFeeOption?: string,
  publicAddress?: string,
  metadata?: any,
  customNetworkFee?: any,
  nativeAmount?: string,
  spendTargets?: Array<AbcSpendTarget>
}

export type SendConfirmationState = {
  pending: boolean,
  isKeyboardVisible: boolean,
  forceUpdateGuiCounter: number,
  transaction: EdgeTransaction | null,
  parsedUri: GuiMakeSpendInfo | EdgeParsedUri,
  error: Error | null,
  isEditable: boolean
}

export const initialState = {
  pending: false,
  isKeyboardVisible: false,
  forceUpdateGuiCounter: 0,
  transaction: null,
  parsedUri: {
    networkFeeOption: (STANDARD_FEE: string),
    customNetworkFee: {},
    publicAddress: '',
    nativeAmount: '0',
    metadata: {
      payeeName: '',
      category: '',
      notes: '',
      amountFiat: 0,
      bizId: 0,
      miscJson: ''
    }
  },
  error: null,
  isEditable: true
}

export const getScene = (state: State): any => getSceneState(state, 'sendConfirmation')
export const getPending = (state: State): boolean => getScene(state).pending
export const getError = (state: State): Error => getScene(state).error
export const getKeyboardIsVisible = (state: State): boolean => getScene(state).keyboardIsVisible

export const getTransaction = (state: State): EdgeTransaction | null => getScene(state).transaction || initialState.transaction
export const getParsedUri = (state: State): GuiMakeSpendInfo => getScene(state).parsedUri || initialState.parsedUri
export const getForceUpdateGuiCounter = (state: State): number => getScene(state).forceUpdateGuiCounter

export const getNetworkFeeOption = (state: State): string => getParsedUri(state).networkFeeOption || initialState.parsedUri.networkFeeOption || ''
export const getCustomNetworkFee = (state: State): any => getParsedUri(state).customNetworkFee || initialState.parsedUri.customNetworkFee || {}
export const getMetadata = (state: State): EdgeMetadata => getParsedUri(state).metadata || initialState.parsedUri.metadata || {}
export const getPublicAddress = (state: State): string => getParsedUri(state).publicAddress || initialState.parsedUri.publicAddress || ''
export const getNativeAmount = (state: State): string => getParsedUri(state).nativeAmount || getParsedUri(state).spendTargets[0].nativeAmount

export const getNetworkFee = (state: State): string => getTransaction(state).networkFee
export const getParentNetworkFee = (state: State): string => getTransaction(state).parentNetworkFee

export const getSpendInfo = (state: State, newSpendInfo?: GuiMakeSpendInfo = {}): EdgeSpendInfo => ({
  currencyCode: newSpendInfo.currencyCode || getSelectedCurrencyCode(state),
  metadata: newSpendInfo.metadata ? { ...getMetadata(state), ...newSpendInfo.metadata } : getMetadata(state),
  spendTargets: [
    {
      nativeAmount: newSpendInfo.nativeAmount || getNativeAmount(state),
      publicAddress: newSpendInfo.publicAddress || getPublicAddress(state)
    }
  ],
  networkFeeOption: newSpendInfo.networkFeeOption || getNetworkFeeOption(state),
  customNetworkFee: newSpendInfo.customNetworkFee ? { ...getCustomNetworkFee(state), ...newSpendInfo.customNetworkFee } : getCustomNetworkFee(state)
})
