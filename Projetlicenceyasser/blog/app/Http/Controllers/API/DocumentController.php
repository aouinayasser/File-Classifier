<?php

namespace App\Http\Controllers\API;
use App\Document;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $documents = Document::all();
        return response()->json($documents);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //Validation
        $request->validate([
            'name_doc' => 'required',
            'type_doc' => 'required',
            'img_doc' => 'required',
            'txt_doc' => 'required',
            'email' => 'required',
        ]);

        //Save in DB
        $document = Document::create([
            'name_doc' => $request->name_doc,
            'type_doc' => $request->type_doc,
            'img_doc' => $request->img_doc,
            'txt_doc' => $request->txt_doc,
            'email' => $request->email
        ]);

        //Return response
        return response()->json($document);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Document $document)
    {
        //Validation
        $request->validate([
            'name_doc' => 'required',
            'type_doc' => 'required',
            'img_doc' => 'required',
            'txt_doc' => 'required',
            'email' => 'required',
        ]);

        //Update in DB
        $document->update([
            'name_doc' => $request->name_doc,
            'type_doc' => $request->type_doc,
            'img_doc' => $request->img_doc,
            'txt_doc' => $request->txt_doc,
            'email' => $request->email
        ]);

        //Return response
        return response()->json($document);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $document = Document::destroy($id);
        return response()->json($document);
    }
}
