<template>
	<form action="" class="p-3 p-lg-4" style="background: white" novalidate>
		<!-- #region 分公司 帳戶 子帳號 -->	
		<div class="row mb-3 text-start">
			<div class="col-12 col-lg-2 mb-2">
				<div class="row">
					<div class="col-4 col-lg-auto">
						<label class="col-form-label fw-bold" for="company">分公司：</label>
					</div>
					<div class="col-auto col-lg-auto">
						<label id="SubcoOrder" class="col-form-label text-start" for="company">
							{{ tradeObject.co }}
						</label>
					</div>
				</div>
			</div>
			<div class="col-12 col-lg-2 mb-2">
				<div class="row">
					<div class="col-4 col-lg-auto">
						<label class="col-form-label fw-bold" for="account">帳號：</label>
					</div>
					<div class="col col-lg-auto">
						<label id="AccOrder" class="col-form-label" for="account">{{tradeObject.acc}}</label>
					</div>
				</div>
			</div>
			<div v-show="IsBaseAccLogin" class="col-12 col-lg-2">
				<div class="row">
					<div class="col-4 col-lg-auto">
						<label class="col-form-label fw-bold" for="subaccount">子帳號</label>
					</div>
					<div class="col-8 col-lg">
						<select id="ordersubaccount" class="form-select" v-model="subaccount"
							:class="{'is-invalid': subaccountError}">
							<option selected disabled value="">未選擇</option>
							<option v-for="item in cust" :key="item" :value="item">{{item.acc}}</option>
						</select>
						<div class="invalid-feedback">請選擇子帳號</div>
					</div>
				</div>
			</div>
		</div>
		<!-- #endregion -->
		<hr/>
		<div>
			<div class="row mt-3 mb-3 text-start" :class="{bgP: PS == 0, bgS: PS == 1}">
				<!-- #region 交易所 -->
				<div class="col-12 col-lg-3 col-xl-2 mt-3 mt-lg-0 mb-3 mb-l">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="exh">交易所</label>
						</div>
						<div class="col-8 col-lg">
							<select
								id="orderexh" class="form-select" v-model="exh"
								:class="{
									'form-control': true,
									'is-invalid': exhError,
								}"
							>
								<option value="" disabled>未選擇</option>
								<option
									v-for="item in cominfo.ExhData_list"
									:key="item"
									:value="item.Exhno"
								>
									{{item.Exhname}} ({{item.Exhno}})
								</option>
							</select>
							<div class="invalid-feedback">請選擇交易所</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 商品別 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3 mb-lg-0">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label for="comtype" class="col-form-label fw-bold">商品別</label>
						</div>
						<div class="col-8 col-lg">
							<select id="ordercomtype" class="form-select" v-model="comtype">
								<option value="0">期貨</option>
								<option value="1">選擇權</option>
							</select>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 商品 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3 mb-lg-0">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label for="com" class="col-form-label fw-bold">商品</label>
						</div>
						<div class="col-8 col-lg">
							<select
								id="ordercom"
								class="form-select"
								v-model="com"
								:class="{
									'is-invalid': comError,
								}"
							>
								<option disabled value="">未選擇</option>
								<option
									v-for="item in computedCom"
									:key="item"
									:value="item.Comno"
								>
									{{ item.ComName }}({{item.Comno}})
								</option>
							</select>
							<div class="invalid-feedback">請選擇商品</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 契約年月 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3 mb-lg-0">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="ContractYM"
								>契約年月</label
							>
						</div>
						<div class="col-8 col-lg">
							<select
								id="ContractYM"
								class="form-select"
								v-model="contractym"
								:class="{
									'is-invalid': contractymError,
								}"
							>
								<option value="" disabled>未選擇</option>
								<option
									v-for="item in computedContract"
									:key="item"
									:value="item.YM"
								>
									{{ item.YM }}
								</option>
							</select>
							<div class="invalid-feedback">請選擇契約年月</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->
				<!-- #region 買賣權 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3" v-if="comtype == 1">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="CP">買權/賣權</label>
						</div>
						<div class="col-8 col-lg">
							<select id="CP" class="form-select" v-model="CP">
								<option value="1">買權</option>
								<option value="2">賣權</option>
							</select>
						</div>
					</div>
				</div>
				<!-- #endregion -->
				<!-- #region 履約價 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3" v-if="comtype == 1">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="stkprcPrice"
								>履約價</label
							>
						</div>
						<div class="col-8 col-lg">
							<select
								id="stkprcPrice"
								class="form-select"
								v-model="stkprice"
								:class="{
									'is-invalid': stkpriceError,
								}"
							>
								<option value="" disabled>未選擇</option>
								<option
									v-for="item in computedContract"
									:key="item"
									:value="item.Stkprcdec"
								>
									{{ item.Stkprcdec }}
								</option>
							</select>
							<div class="invalid-feedback">請選擇履約價</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 買/賣 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3 mb-lg-0">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="PS">買/賣</label>
						</div>
						<div class="col-8 col-lg">
							<select id="PS" class="form-select" v-model="PS">
								<option value="0">買</option>
								<option value="1">賣</option>
							</select>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 口數 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3 mb-lg-0">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="qty">口數</label>
						</div>
						<div class="col-8 col-lg">
							<input
								id="qty"
								type="number"
								class="form-control"
								v-model="qty"
								:disabled="isLimit"
								:class="{'is-invalid': qtyError}"
							/>
							<div class="invalid-feedback">請輸入正確口數</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 委託條件 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label class="col-form-label fw-bold" for="ordertype"
								>委託條件</label
							>
						</div>
						<div class="col-8 col-lg">
							<select
								id="ordertype"
								class="form-select"
								v-model="ordertype"
								:disabled="isLimit"
							>
								<option value="0">限價</option>
								<option value="1" v-if="isMktFlag">市價</option>
								<option value="2" v-if="isStpFlag">停損限價</option>
								<option value="3" v-if="isSwlFlag">停損市價</option>
							</select>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 單價 -->
				<div class="col-12 col-lg-4 col-xl-3 col-xxl-2 mb-3" >
					<div class="row">
						<div class="col-4 col-lg-12">
							<label for="price" class="col-form-label fw-bold">單價</label>
						</div>
						<div v-show="ordertype != 1 && ordertype != 3"  class="col-3 col-lg-3 pe-0">
							<select id="priceInt" class="form-select" v-model="priceInt" @change="priceConvert()" :disabled="isLimit">
								<option value="0">+</option>
								<option value="1">-</option>
							</select>
						</div>
						<div v-show="ordertype != 1 && ordertype != 3" class="col-5 col-lg-4 ps-1">
							<input
								id="price1"
								class="form-control ps-2 pe-2"
								:class="{'is-invalid': price1Error}"
								type="number"
								:step="IntStep"
								v-model="price1"
								:disabled="isLimit"
							/>
							<div class="invalid-feedback">{{ price1Msg }}</div>
						</div>
						<div v-show="ordertype != 1 && ordertype != 3" class="col-6 offset-4 col-lg-5 offset-lg-0 ps-2 mt-2 mt-md-0">
							<div class="row" style="padding-left:12px">
								<input
									id="price2"
									class="col form-control ps-2 pe-2"
									type="number"
									:step="NumeratorStep"
									:disabled="price3 <= 1 || isLimit"
									v-model="price2"
									:class="{
										'is-invalid': price2Error,
									}"
								/>
								<span
									id="price3"
									class="col-4 input-group-text me-2 ps-1"
									>/ {{ price3 }}</span
								>
								<div class="invalid-feedback">{{ price2Msg }}</div>
							</div>
						</div>
						<div v-show="ordertype == 1 || ordertype == 3" class="col-8 col-lg-12">
							<input
								id="price1_mkt"
								class="form-control"
								type="text"
								value="市價"
								disabled="true"
							/>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 停損價 -->
				<div class="col-12 col-lg-4 col-xl-3 col-xxl-2 mb-3" v-if="ordertype == 2 || ordertype == 3">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label for="stpprice" class="col-form-label fw-bold">停損價</label>
						</div>
						<div class="col-3 col-lg-3 pe-0">
							<select id="stpriceInt" class="form-select" v-model="stpriceInt" @change="stpriceConvert()">
								<option value="0">+</option>
								<option value="1">-</option>
							</select>
						</div>
						<div class="col-5 col-lg-4 ps-1">
							<input
								id="price4"
								class="form-control ps-2 pe-2"
								type="number"
								:step="IntStep"
								v-model="price4"
								:disabled="isLimit"
								:class="{
									'is-invalid': price4Error,
								}"
							/>
							<div class="invalid-feedback">{{ price4Msg }}</div>
						</div>
						<div class="col-6 offset-4 col-lg-5 offset-lg-0 ps-2 mt-2 mt-md-0">
							<div class="row" style="padding-left:12px">
								<input
									id="price5"
									class="col form-control ps-2 pe-2"
									type="number"
									:step="NumeratorStep"
									:disabled="price3 <= 1 || isLimit"
									v-model="price5"
									:class="{
										'is-invalid': price5Error,
									}"
								/>
								<span id="price6" class="col-4 input-group-text me-2 ps-1">/ {{ price6 }}</span>
								<div class="invalid-feedback">{{ price5Msg }}</div>
							</div>
						</div>
					</div>
				</div>
				<!-- #endregion -->

				<!-- #region 當沖 -->
				<div class="col-12 col-lg-3 col-xl-2 mb-3" v-if="isDtradeFlag">
					<div class="row">
						<div class="col-4 col-lg-12">
							<label for="Pawn" class="col-form-label fw-bold">當沖</label>
						</div>
						<div class="col-8 col-lg">
							<select
								class="form-select"
								id="Pawn"
								v-model="Pawn"
								:disabled="isLimit">
								<option value="1">是</option>
								<option value="0">否</option>
								<option value="2">自動</option>
							</select>
						</div>
					</div>
				</div>
				<!-- #endregion -->
			</div>
		</div>
		<hr/>
		<div class="row text-start mt-3 mb-4">
			<!-- #region 觸發價 -->
			<div class="col-12 col-lg-4 mb-3">
				<div class="row">
					<div class="col-12 col-lg-12">
						<label for="tpl" class="col-form-label fw-bold">觸發價</label>
					</div>
					<div class="col-12 col-lg-3 mb-3 mb-lg-0">
						<select
							id="tpl"
							class="form-select ps-1"
							v-model="tpl"
							:class="{
								'is-invalid': tplError,
							}"
						>
							<option value="" disabled>未選擇</option>
							<option value="2">大於等於(&ge;)</option>
							<option value="4">小於等於(&le;)</option>
						</select>
						<div class="invalid-feedback">請選擇觸發條件</div>
					</div>
					<div class="col-2 col-lg-2 pe-0">
						<select id="tpriceInt" class="form-select" v-model="tpriceInt" @change="tpriceConvert()">
							<option value="0">+</option>
							<option value="1">-</option>
						</select>
					</div>
					<div class="col-4 col-lg-3">
						<input
							id="tprice1"
							class="form-control"
							type="number"
							:step="IntStep"
							v-model="tprice1"
							placeholder="觸發價金額"
							:class="{
								'is-invalid': tprice1Error,
							}"/>
						<div class="invalid-feedback">{{ tprice1Msg }}</div>
					</div>
					<div class="col-6 col-lg-4">
						<div class="row">
							<input
								id="tprice2"
								class="col form-control"
								type="number"
								:step="NumeratorStep"
								:disabled="price3 <= 1"
								v-model="tprice2"
								:class="{
									'is-invalid': tprice2Error,
								}"/>
							<span id="tprice3" class="col input-group-text me-2">/ {{ tprice3 }}</span>
							<div class="invalid-feedback">{{ tprice2Msg }}</div>
						</div>
					</div>
				</div>
			</div>
			<!-- #endregion -->
			<!-- #region 有效日期 -->
			<div class="col-12 col-lg-8 col-xl-8 col-xxl mb-3 mb-lg-0">
				<div class="row align-items-center">
					<div class="col-12 col-lg-12">
						<label
							id="startdata-label"
							class="col-form-label fw-bold"
							for="startdate"
							>有效日期</label
						>
					</div>
					<div class="col-12 col-lg-4">
						<input
							type="Date"
							class="form-control date"
							id="startdate"
							v-model="startdate"
							:class="{
								'is-invalid': startdateError,
							}"
						/>
						<div class="invalid-feedback">請輸入起始日期</div>
					</div>
					<div class="col-12 col-lg-auto">至</div>
					<div class="col-12 col-lg-4">
						<input
							type="Date"
							class="form-control date"
							id="EndDateOrder"
							:min="startdate"
							:max="endCondDate()"
							v-model="enddate"
							:class="{
								'is-invalid': enddateError,
							}"
						/>
						<div class="invalid-feedback">請輸入結束日期</div>
					</div>
				</div>
			</div>
			<!-- #endregion -->
		</div>
		<!-- #region 清除下單按鈕 -->
		<div v-if="canTrade" class="row mb-4 justify-content-end">
			<div class="col-6 col-md-3 col-lg-2 col-xl-1 text-end">
				<button
					class="btn SGTP-BtnStyle-cancel w-100 w-xl-75"
					type="button"
					@click="OnReset">
					清除
				</button>
			</div>
			<div class="col-6 col-md-3 col-lg-2 col-xl-1 text-end" v-if="!(isCA&&!HaveCheckCertExist)">
				<!-- v-on:click="Order"  -->
				<button 
					id="OrderBtn"
					class="btn SGTP-BtnStyle-confirm w-100 w-xl-75"
					type="button"
					@click="OnClickOrder"
					:disabled="!(canTrade&&haveSub)">
					下單
				</button>
			</div>
			<div class="col-6 col-md-3 col-lg-2 col-xl-2 text-end" v-if="isCA && !HaveCheckCertExist">
				<button
					class="btn SGTP-BtnStyle-pause w-100 w-xl-75"
					type="button"
					@click="OnCA">
					檢查憑證
				</button>
			</div>
		</div>
		<!-- #endregion -->
	</form>
</template>

<script>
import {computed, ref, toRef} from "@vue/reactivity";
import {onMounted, watch} from "@vue/runtime-core";
import {useStore} from "vuex";
import convert from "../utility/convert";
export default {
	props: {
		IsKeepOrder:{
			type:Boolean,
		}
	},
	emits: ["sendorder", "ca"],
	setup(props, context) {
		//variable
		const cominfo = computed(()=>{
			return store.state.FilterComData;
    });
		const keepOrder = toRef(props,"IsKeepOrder");
		const store = useStore();
		const IsBaseAccLogin = computed(()=>{
			return store.state.CustObj.IsBaseAccLogin;
		})
    const cust = computed(()=>{
			return store.state.FilterAccData.cust;
    });
		const canTrade  = computed(()=>{	//判斷下單
			return store.state.CanTrade
		});
		var subaccount = ref(""); //子帳號
		var exh = ref(""); //交易所
		var comtype = ref(""); //商品種類
		var com = ref(""); //商品
		var contractym = ref(""); //契約月份
		var ordertype = ref(""); //委託種類
		var CP = ref(""); //買或賣權
		var stkprice = ref(""); //履約價
		var PS = ref(""); //買或賣
		var tpl = ref(""); //觸發價邏輯
		var qty = ref(""); //口數
		var startdate = ref(""); //開始時間
		var enddate = ref(""); //結束時間
		var Pawn = ref(""); //是否當沖
		var clientip = ref(""); //IP
		var priceInt = ref(); 	//單價正負數
		var stpriceInt = ref(); //停損價正負數
		var tpriceInt = ref(); 	//觸發價正負數
		var price1 = ref(); //單價整數
		var price2 = ref(); //單價分子
		var price3 = ref(); //單價分母
		var price4 = ref(); //停損價整數
		var price5 = ref(); //停損價分子
		var price6 = ref(); //停損價分母
		var tprice1 = ref(); //觸發價整數
		var tprice2 = ref(); //觸發價分子
		var tprice3 = ref(); //觸發價分母
		var IntStep = ref(""); //整數step
		var NumeratorStep = ref(""); //分子step
		var isDtradeFlag = ref(""); //當沖權限
		var isMktFlag = ref(""); //市價權限
		var isStpFlag = ref(""); //停損市價權限
		var isSwlFlag = ref(""); //停損限價權限
		var isLimit = ref(true); //限制商品以外操作
		var tradeObject = ref({
			"condcmd": 1, //新增條件單
			"op": "bos", //BOS自己
			"src": store.state.CustObj.sr, //測試來源別，Trust給的
			"acc": store.state.CustObj.Ac, //測試帳號，Trust給的
			"co": store.state.CustObj.Fm, //測試公司碼，Trust給的
			"subacc":'',
			"subco":'',
		});
		//畫面檢驗使用
		var isValid = ref(true);     //是否要驗證(下單後不需要檢驗)
		var price1Error = ref();
		var price1Msg = ref("");
		var price2Error = ref();
		var price2Msg = ref("");
		var price4Error = ref();
		var price4Msg = ref("");
		var price5Error = ref();
		var price5Msg = ref("");
		var tprice1Error = ref();
		var tprice1Msg = ref("");
		var tprice2Error = ref();
		var tprice2Msg = ref("");
		var subaccountError = ref();
		var exhError = ref();
		var comError = ref();
		var contractymError = ref();
		var stkpriceError = ref();
		var qtyError = ref();
		var tplError = ref();
		var startdateError = ref();
		var enddateError = ref();
		var valid = ref();
		//computed
		//有無憑證
    const HaveCheckCertExist = computed(()=>{
      return store.state.HaveCheckCertExist;
    });
		//是否要驗憑證
		const isCA  = computed(()=>{	
			return store.state.CustObj.IsCA
		});
		//篩選商品資料
		const computedCom = computed(() => {
			if (cominfo.value.ComData_list != null && exh.value != null && comtype.value != null) {
				// 判斷交易所 & 商品類別
				return cominfo.value.ComData_list.filter(
					(item) => item.Exhno == exh.value && item.Comtype == comtype.value,
				);
			} else {
				return "";	//原本是Null
			}
		});

		//篩選契約月份資料
		const computedContract = computed(() => {
			if (cominfo.value.Contract_list != null && comtype.value != null) {
				// 判斷商品 & CallPut
				return cominfo.value.Contract_list.filter(
					(item) => item.Comno == com.value 
				);
			} else {
				return "";	//原本是Null
			}
		});
		
		const haveSub = computed(()=>{
			if(cust.value.length>0)
			{
				//有子物件選擇才能下單
				if(subaccount.value!=""){
					if(subaccount.value.gtdflg==1 && subaccount.value.tdflg=='Y'){
						return true;
					}
				}
				return false;
			}else{
				return true;
			}
		})
	
		watch(keepOrder,()=>{
			if(!keepOrder.value){
				OnReset();
				isValid.value = false;
			}
		});
		//更新時
		watch(subaccount, () => {
			console.log(subaccount.value.gtdflg);
			if(isValid.value) validempty("subaccount", subaccount.value);
			if (cust.value.length > 0 && subaccount.value!=''){
				if(subaccount.value==''){
					tradeObject.value.subacc='';
					tradeObject.value.subco= '';
				}else{
					tradeObject.value.subacc=subaccount.value.acc;
					tradeObject.value.subco= subaccount.value.co;
				}
			}
		});
		watch(exh, () => {
			if(isValid.value) validempty("exh", exh.value);
			tradeObject.value.exh = exh.value;
			//清除商品
			//com.value=computedCom.value[0].Comno;
			com.value=""
		});
		watch(comtype, () => {
			tradeObject.value.ctyp = comtype.value;
			//清除商品
			com.value = "";
			//設定CallPut
			if (comtype.value == 0) {
				//期貨
				CP.value = 0;
			} else if (comtype.value == 1) {
				//選擇權
				CP.value = 1;
			}
		});
		watch(com, () => {
			if(isValid.value) validempty("com", com.value);
			//清除契約月份及委託類別
			contractym.value = "";
			ordertype.value = "0";
			//執行初始化
			InitialAuth();
			InitialPrice();
			Selectlimit();

			if (com.value != "") {
				tradeObject.value.com = com.value;
				var selectedcom = cominfo.value.ComData_list.find(
					(item) => item.Comno == tradeObject.value.com,
				);
				if (selectedcom != undefined) {

					//設定委託條件
					isDtradeFlag.value = Authority(selectedcom.DtradeFlag);
					isMktFlag.value = Authority(selectedcom.MktFlag);
					isStpFlag.value = Authority(selectedcom.StpFlag);
					isSwlFlag.value = Authority(selectedcom.SwlFlag);

					//設定跳動點
					if (selectedcom.Denominator > 1) {
						NumeratorStep.value = selectedcom.Tickunit;
						IntStep.value = 1;
						price3.value = selectedcom.Denominator;
						price6.value = selectedcom.Denominator;
						tprice3.value = selectedcom.Denominator;
					} else {
						IntStep.value = selectedcom.Tickunit;
						NumeratorStep.value = 1;
					}
				}
			}
		});
		watch(contractym, () => {
			if(isValid.value) validempty("contractym", contractym.value);
			tradeObject.value.ym = contractym.value;
			//清除履約價
			stkprice.value = "";
			//開啟驗證動作
			isValid.value = true;
		});
		watch(stkprice, () => {
			if(isValid.value) validempty("stkprice", stkprice.value);
			tradeObject.value.stkprc = stkprice.value;
		});

		watch(PS, () => {
			tradeObject.value.ps = PS.value;
		});
		watch(qty, () => {
			tradeObject.value.qty = qty.value;
			if(isValid.value) validqty(qty.value);
		});
		watch(ordertype, () => {
			tradeObject.value.ordtyp = ordertype.value;

			if (ordertype.value == 1 || ordertype.value == 3) {
				//市價、停損市價
				price1.value = 0;
				price2.value = 0;
			}
			if (ordertype.value == 0 || ordertype.value == 1) {
				price4.value = 0;
				price5.value = 0;
			}
		});

		watch(price1, () => {
			priceConvert();
			if(isValid.value) validp1('p1',price1.value);
		});
		watch(price2, () => {
			priceConvert();
			if(isValid.value) validp2('p2',price2.value);
		});
		watch(price3, () => {
			tradeObject.value.p3 = price3.value;
		});
		watch(price4, () => {
			stpriceConvert();
			if(isValid.value) validp1('p4',price4.value);
		});
		watch(price5, () => {
			stpriceConvert();
			if(isValid.value) validp2('p5',price5.value);
		});
		watch(price6, () => {
			tradeObject.value.p6 = price6.value;
		});
		watch(tpl, () => {
			tradeObject.value.tpl = tpl.value;
			if(isValid.value) validempty("tpl", tpl.value);
		});
		watch(tprice1, () => {
			tpriceConvert();
			if(isValid.value) validp1('tp1',tprice1.value);
		});
		watch(tprice2, () => {
			tpriceConvert();
			if(isValid.value) validp2('tp2',tprice2.value);
		});
		watch(tprice3, () => {
			tradeObject.value.tp3 = tprice3.value;
		});

		watch(startdate, () => {
			tradeObject.value.startdt = startdate.value.replace( /-/g , '/' );
			validempty("startdate", startdate.value);
		});
		watch(enddate, () => {
			tradeObject.value.enddt = enddate.value.replace( /-/g , '/' );
			validempty("enddate", enddate.value);
		});
		watch(isDtradeFlag, () => {
			isDtradeFlag == false ? (Pawn.value = " ") : (Pawn.value = 2);
		});
		watch(Pawn, () => {
			tradeObject.value.dtrd = Pawn.value;
		});
		watch(CP, () => {
			tradeObject.value.cp = CP.value;
		});

		//methods
		const priceConvert = () => {
			if(priceInt.value==0){
				tradeObject.value.p1 = price1.value;
				tradeObject.value.p2 = price2.value;
			}else{
				tradeObject.value.p1 = price1.value*-1;
				tradeObject.value.p2 = price2.value*-1;
			}
		}

		const stpriceConvert = () => {
			if(stpriceInt.value==0){
				tradeObject.value.p4 = price4.value;
				tradeObject.value.p5 = price5.value;
			}else{
				tradeObject.value.p4 = price4.value*-1;
				tradeObject.value.p5 = price5.value*-1;
			}
		}

		const tpriceConvert = () => {
			if(tpriceInt.value==0){
				tradeObject.value.tp1 = tprice1.value;
				tradeObject.value.tp2 = tprice2.value;
			}else{
				tradeObject.value.tp1 = tprice1.value*-1;
				tradeObject.value.tp2 = tprice2.value*-1;
			}
		}

		const GetIP = () => {
			fetch("https://api.ipify.org?format=json")
				.then((x) => x.json())
				.then(({ip}) => {
					clientip.value = ip;
					tradeObject.value.ip = clientip.value; //綁ip
				});
		};

		const Authority = (Flag) => {
			switch (Flag) {
				case "N":
					return false;
				case "Y":
					return true;
				default:
					return false;
			}
		};
		const Selectlimit = () => {
			isLimit.value =
				exh.value != "" && comtype.value != "" && com.value != ""
					? false
					: true;
		};

		const getToday = () => {
			var date = new Date();
			var YY = date.getFullYear();
			var MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
			var dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
			var day = YY + "-" + MM + "-" + dd;
			var dateString = day;
			return dateString;
		};

		const InitialAuth = () => {
			isDtradeFlag.value = true;
			isMktFlag.value = true;
			isStpFlag.value = true;
			isSwlFlag.value = true;
		};

		const InitialPrice = () => {
			priceInt.value = 0;
			stpriceInt.value = 0;
			tpriceInt.value = 0;
			price1.value = 0;
			price2.value = 0;
			price3.value = 1;
			price4.value = 0;
			price5.value = 0;
			price6.value = 1;
			tprice1.value = 0;
			tprice2.value = 0;
			tprice3.value = 1;
		};

		const InitialValid = () => {
			price1Error.value = false;
			price2Error.value = false;
			price4Error.value = false;
			price5Error.value = false;
			tprice1Error.value = false;
			tprice2Error.value = false;
			subaccountError.value = false;
			exhError.value = false;
			comError.value = false;
			contractymError.value = false;
			stkpriceError.value = false;
			qtyError.value = false;
			tplError.value = false;
			startdateError.value = false;
			enddateError.value = false;
			valid.value = false;
		};

		const endCondDate=()=>{
			let date= new Date();
			date.setDate(new Date(startdate.value).getDate()+30);
			let YY = date.getFullYear();
			let MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
			let dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
			let day = YY + "-" + MM + "-" + dd;
			let dateString = day;
			return dateString;
		}

		const OnReset = () => {
			subaccount.value = "";
			exh.value = "";
			comtype.value = "0"; //商品種類
			ordertype.value = "0"; //委託種類
			PS.value = "0"; //買或賣
			tpl.value = ""; //觸發價邏輯
			qty.value = ""; //口數
			startdate.value = getToday(); //開始時間
			enddate.value = getToday(); //結束時間
			IntStep.value = 1; //整數step
			NumeratorStep.value = 1; //分子step
			InitialAuth();
			InitialPrice();
			InitialValid();
			endCondDate();
		};

		const validp1 = (type,item) => {
			var tempMsg = "";
			var tempError = false;
			if (item == "市價") return true;

			if(item === null || item === '')
			{
				tempMsg = "尚未輸入價格";
				tempError = true;
			}
			else if (price3.value > 1)
			{
				//有分母商品，P1必為整數
				if(!((item | 0) === item)){
					tempMsg = "請輸入整數";
					tempError = true;
				}
				if(item<0){
					tempMsg = "請輸入整數";
					tempError = true;
				}
			}
			else
			{
				if( item>=0){
					if(floatSafeRemainder(item, IntStep.value) != 0)
					{
						tempMsg = "不符合該商品跳動點";
						tempError = true;
					}
				}else{
					tempMsg = "請輸入正數"; 
					tempError = true;
				}
			}

			switch (type) {
				case 'p1':
					price1Msg.value = (tempError) ? tempMsg:"";
					price1Error.value = tempError;
					break;
				case 'p4':
					price4Msg.value = (tempError) ? tempMsg:"";
					price4Error.value = tempError;
					break;
				case 'tp1':
					tprice1Msg.value = (tempError)? '觸發價 - '+tempMsg :"";
					tprice1Error.value = tempError;
					break;
			}
			return !tempError;
		};

		const validp2 = (type,item) => {
			var tempMsg = "";
			var tempError = false;

			if( (item === null || item ==='' ))
			{
					tempMsg = "尚未輸入價格";
					tempError = true;
			}
			else if (price3.value > 1)	//有分母商品，P1必為整數
			{ 
				if( item>=0){
					if (floatSafeRemainder(item, NumeratorStep.value) != 0) {
							tempMsg = "不符合該商品跳動點"; 
							tempError = true;
					}
					else if( item > price3.value){
							tempMsg = "輸入數值請小於:"+price3.value;
							tempError = true;
					}
				}
				else{
					tempMsg = "請輸入正數"; 
					tempError = true;
				}
			}

			switch (type) {
				case 'p2':
					price2Msg.value = (tempError)? tempMsg :"";
					price2Error.value = tempError;
					break;
				case 'p5':
					price5Msg.value = (tempError)? tempMsg :"";
					price5Error.value = tempError;
					break;
				case 'tp2':
					tprice2Msg.value = (tempError)? '觸發價分子 - '+tempMsg :"";
					tprice2Error.value = tempError;
					break;
			}
			return !tempError;
		};

		const validempty = (type, item) => {
			if (item == "" || item == "undefined") {
				switch (type) {
					case "subaccount":
						subaccountError.value = true;
						break;
					case "exh":
						exhError.value = true;
						break;
					case "com":
						comError.value = true;
						break;
					case "contractym":
						contractymError.value = true;
						break;
					case "stkprice":
						stkpriceError.value = true;
						break;
					case "tpl":
						tplError.value = true;
						break;
					case "startdate":
						startdateError.value = true;
						break;
					case "enddate":
						enddateError.value = true;
						break;
					default:
						break;
				}
				return false;
			}

			switch (type) {
				case "subaccount":
					subaccountError.value = false;
					break;
				case "exh":
					exhError.value = false;
					break;
				case "com":
					comError.value = false;
					break;
				case "contractym":
					contractymError.value = false;
					break;
				case "stkprice":
					stkpriceError.value = false;
					break;
				case "tpl":
					tplError.value = false;
					break;
				case "startdate":
					startdateError.value = false;
					break;
				case "enddate":
					enddateError.value = false;
					break;
				default:
					break;
			}
			return true;
		};

		const floatSafeRemainder = (val, step) => {
			var valDecCount = (val.toString().split(".")[1] || "").length;
			var stepDecCount = (step.toString().split(".")[1] || "").length;
			var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
			var valInt = parseInt(val.toFixed(decCount).replace(".", ""));
			var stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
			return (valInt % stepInt) / Math.pow(10, decCount);
		};

		const validqty = (item) => {
			qtyError.value = false;
			if ((item | 0) === item && item > 0 && item < 101) {
				return true;
			}
			qtyError.value = true;
			return false;
		};

		const validate = () => {
			valid.value = true;

			if (!validempty("exh", exh.value)) {
				valid.value = false;
			}
			if (!validempty("subaccount", subaccount.value) && cust.length>0) {
				valid.value = false;
			}
			if (!validempty("com", com.value)) {
				valid.value = false;
			}
			if (!validempty("contractym", contractym.value)) {
				valid.value = false;
			}
			if (!validempty("stkprice", stkprice.value) && comtype.value == 1) {
				valid.value = false;
			}
			if (!validqty(qty.value)) {
				valid.value = false;
			}
			if (!validp1('p1',price1.value)) {
				valid.value = false;
			}
			if (!validp2('p2',price2.value)) {
				valid.value = false;
			}
			if (!validp1('p4',price4.value)) {
				valid.value = false;
			}
			if (!validp2('p5',price5.value)) {
				valid.value = false;
			}
			if (!validempty("tpl",tpl.value)) {
				valid.value = false;
			}
			if (!validp1('tp1',tprice1.value)) {
				valid.value = false;
			}
			if (!validp2('tp2',tprice2.value)) {
				valid.value = false;
			}
			if (!validempty("startdate", startdate.value)) {
				valid.value = false;
			}
			if (!validempty("enddate", enddate.value)) {
				valid.value = false;
			}
		};

		//emit methods
		const OnClickOrder = () => {
			validate();
			console.log('新增下單傳送',tradeObject.value);
			if(valid.value){	//驗證無誤
				let order ={
					cmd:1,
					data:[tradeObject.value],
					single:true,
				};
				context.emit("sendorder", order);
			}
		};

		const OnCA = () => {
			//檢查憑證
			context.emit("ca");
		};
		
		//Call method
		GetIP();
		
		onMounted(()=>{
			OnReset();
		});

		return {
			cominfo,
			canTrade,
			haveSub,
			IsBaseAccLogin,
			cust,
			subaccount,
			comtype,
			CP,
			stkprice,
			exh,
			com,
			PS,
			tpl,
			qty,
			startdate,
			enddate,
			Pawn,
			contractym,
			ordertype,
			priceInt,
			stpriceInt,
			tpriceInt,
			price1,
			price2,
			price3,
			price4,
			price5,
			price6,
			tprice1,
			tprice2,
			tprice3,
			priceConvert,
			stpriceConvert,
			tpriceConvert,
			IntStep,
			NumeratorStep,
			isDtradeFlag,
			isMktFlag,
			isStpFlag,
			isSwlFlag,
			isLimit,
			isCA,
			HaveCheckCertExist,
			computedCom,
			computedContract,
			tradeObject,
			OnClickOrder,
			OnReset,
			OnCA,
			InitialAuth,
			InitialPrice,
			getToday,
			endCondDate,
			price1Error,
			price1Msg,
			price2Error,
			price2Msg,
			price4Error,
			price4Msg,
			price5Error,
			price5Msg,
			tprice1Error,
			tprice1Msg,
			tprice2Error,
			tprice2Msg,
			subaccountError,
			exhError,
			comError,
			contractymError,
			stkpriceError,
			qtyError,
			tplError,
			startdateError,
			enddateError,
			validempty,
			validqty,
			validp1,
			validp2,
			validate,
			valid,
		};
	}
};
</script>

<style lang="scss" scoped>
  @import "@/ColorStyle/scss/styleconfig.scss";
  @import "@/ColorStyle/scss/SGTP.scss";
	.bgP {
		background: #eb9090;
	}
	.bgS {
		background: #74bb74;
	}
</style>
