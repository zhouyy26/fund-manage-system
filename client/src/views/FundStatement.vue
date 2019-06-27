<template>
  <div class="fund-statement-wrap">
    <div class="form-box">
      <el-form :inline="true" :model="filterFormData">
        <el-form-item label="收支类型">
          <el-select v-model="filterFormData.type" size="medium" placeholder="请选择收支类型">
            <el-option label="全部" value="全部"></el-option>
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="filterFormData.date"
            type="daterange"
            size="medium"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="filterData">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="resetData">重置</el-button>
        </el-form-item>
        <el-form-item v-if="identity === 'manage'" class="btnRight">
          <el-button type="primary" size="medium" @click="addBtn">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="date" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{scope.row.date | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收支类型" prop="type" width="100"></el-table-column>
        <el-table-column label="收支描述" prop="describe" width="150"></el-table-column>
        <el-table-column label="收入" prop="income" width="120">
          <template slot-scope="scope">
            <span style="color: #00d053">+ {{scope.row.income}}</span>
          </template>
        </el-table-column>
        <el-table-column label="支出" prop="expend" width="120">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{scope.row.expend}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户现金" prop="cash" width="120">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{scope.row.cash}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column v-if="identity === 'manage'" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editBtn(scope.$index, scope.row)" >编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.$index, scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.current"
        :page-sizes="page.sizes"
        :page-size="page.size"
        :total="page.total"
        :layout="page.layout"
        @size-change="changeSizePage"
        @current-change="changeCurrentPage"
      ></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="isDialog">
      <el-form ref="dialogFormData" :model="dialogFormData" :rules="dialogRules" label-width="80px">
        <el-form-item label="收支类型" prop="type">
          <el-select v-model="dialogFormData.type">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收支描述" prop="describe">
          <el-input v-model="dialogFormData.describe"></el-input>
        </el-form-item>
        <el-form-item label="收入" prop="income">
          <el-input v-model="dialogFormData.income"></el-input>
        </el-form-item>
        <el-form-item label="支出" prop="expend">
          <el-input v-model="dialogFormData.expend"></el-input>
        </el-form-item>
        <el-form-item label="现金" prop="cash">
          <el-input v-model="dialogFormData.cash"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="dialogFormData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm('dialogFormData')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'myFundStatement',
  data() {
    return {
      allTableData: [],
      filterTableData: [],
      tableData: [],
      filterFormData: {
        type: '',
        date: [],
      },
      typeList: ['提现', '提现手续费', '充值', '优惠券', '充值礼券', '转账'],
      isDialog: false,
      dialogTitle: '',
      dialogFormData: {},
      dialogRules: {
        type: [{ required: true, message: "请选择收支类型！", trigger: "blur" }],
        income: [{ required: true, message: "收入不能为空！", trigger: "blur" }],
        expend: [{ required: true, message: "支出不能为空！", trigger: "blur" }],
        cash: [{ required: true, message: "账户现金不能为空！", trigger: "blur" }]
      },
      page: {
        current: 1,
        size: 5,
        sizes: [5, 10, 15, 20],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  created() {
    this.getTableData();
  },
  computed: {
    identity() {
      return this.$store.getters.user.identity;
    }
  },
  methods: {
    // 获取数据
    getTableData() {
      this.$axios.get('/api/profiles').then(res => {
        const data = res.data.reverse();
        this._clearFilterFormData();
        this.allTableData = data;
        this.filterTableData = data;
        this.tableData = data;
        this.initPageData();
      });
    },
    // 筛选
    filterData() {
      const data = this.filterFormData;
      const type = data.type;
      const date = data.date;
      let typeData = [];
      let dateData = [];
      // 没有筛选项
      if (!type && date.length === 0) {
        this.$message('请选择筛选项');
        return;
      }
      // 收支类型
      if (type && type !== '全部') {
        typeData = this.allTableData.filter(item => {
          return item.type === type;
        });
      } else {
        typeData = this.allTableData;
      }
      // 日期
      if (date.length !== 0) {
        const startTime = new Date(date[0]).getTime(); // 格式化date,并转化为毫秒数
        const endTime = new Date(date[1]).getTime();
        dateData = typeData.filter(item => {
          const time = new Date(item.date).getTime();
          return time >= startTime && time <= endTime;
        });
      } else {
        dateData = typeData;
      }
      this.page.total = dateData.length;
      this.filterTableData = dateData;
      this.tableData = this._setPage(dateData);
    },
    // 重置
    resetData() {
      const data = this.allTableData;
      this._clearFilterFormData();
      this.page.total = data.length;
      this.tableData = this._setPage(data);
    },
    // 添加
    addBtn() {
      this.dialogTitle = '添加资金流水';
      this.dialogFormData = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: '',
      }
      this.isDialog = true;
    },
    // 编辑
    editBtn(index, row) {
      this.dialogTitle = '编辑资金流水';
      this.dialogFormData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
      this.isDialog = true;
    },
    // 删除
    deleteData(index, row) {
      this.$axios.delete(`api/profiles/delete/${row._id}`).then(res => {
        this.$message.success('删除成功');
        this.getTableData();
      });
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.dialogFormData;
          const url = this.dialogTitle === '添加资金流水' ? 'insert' : `update/${data.id}`;
          this.$axios.post(`api/profiles/${url}`, data).then(res => {
            this.$message.success('操作成功');
            this.isDialog = false;
            this.getTableData();
          });
        }
      });
    },
    // 初始化分页数据
    initPageData() {
      const data = this.filterTableData
      this.page.total = data.length;
      this.tableData = this._setPage(data);
    },
    // 切换sizi
    changeSizePage(size) {
      this.page.size = size;
      this.tableData = this._setPage(this.filterTableData, size);
    },
    // 切换current
    changeCurrentPage(current) {
      this.page.current = current;
      this.tableData = this._setPage(this.filterTableData, undefined, current);
    },
    // 设置page
    _setPage(data, size = this.page.size, current = 1) {
      const startIndex = (current - 1) * size;
      const endIndex = startIndex + size;
      return data.filter((item, index) => {
        return index >= startIndex && index < endIndex;
      });
    },
    _clearFilterFormData() {
      this.filterFormData = {
        type: '',
        date: []
      };
    }
  },
  filters: {
    formatDate(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() >= 10 ? date.getMonth() : `0${date.getMonth()}`;
      const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
      const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
      const minute = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
      const second = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
}
</script>