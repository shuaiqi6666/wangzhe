module.exports = app => {
    const express = require("express");
    const router = express.Router({
        mergeParams: true
    });
    // 新建分类
    router.post("/", async (req, res) => {
        const model = await req.Model.create(req.body);
        res.send(model);
    });
    // 分类列表
    router.get("/", async (req, res) => {
        const qureyOptions = {}
        if (req.Model.modelName == "Category") {
            qureyOptions.populate = "parent"
        }
        const items = await req.Model.find().setOptions(qureyOptions).limit(10);
        res.send(items);
    });
    // 通过ID获取每一个详情页
    router.get("/:id", async (req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    });
    // 修改保存
    router.put("/:id", async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        res.send(model);
    });
    //  删除分类
    router.delete("/:id", async (req, res) => {
        const items = await req.Model.findByIdAndDelete(req.params.id, req.body);
        res.send({
            success: true
        });
    });
    app.use("/admin/api/rest/:resource", async (req, res, next) => {
        const modelName = require("inflection").classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router);
    // 上传图片
    const multer = require("multer")
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post("/admin/api/upload", upload.single('file'), async (req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
};
